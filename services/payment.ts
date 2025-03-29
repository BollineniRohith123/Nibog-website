import crypto from 'crypto';
import axios from 'axios';

interface PaymentInitiationParams {
  registrationId: number;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface PaymentVerificationParams {
  merchantTransactionId: string;
  transactionId: string;
}

class PhonePePaymentService {
  private merchantId: string;
  private saltKey: string;
  private apiEndpoint: string;

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || '';
    this.saltKey = process.env.PHONEPE_SALT_KEY || '';
    this.apiEndpoint = process.env.PHONEPE_ENVIRONMENT === 'production' 
      ? 'https://api.phonepe.com/apis/hermes' 
      : 'https://api-preprod.phonepe.com/apis/hermes';
  }

  // Initiate payment
  async initiatePayment(params: PaymentInitiationParams): Promise<string> {
    try {
      const merchantTransactionId = `MT${params.registrationId}${Date.now()}`;
      
      const payloadData = {
        merchantId: this.merchantId,
        merchantTransactionId,
        amount: params.amount * 100, // Convert to paisa
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        redirectMode: 'POST',
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        customerPhone: params.customerPhone
      };

      const base64Payload = Buffer.from(JSON.stringify(payloadData)).toString('base64');
      const checksum = this.generateChecksum(base64Payload);

      const response = await axios.post(
        `${this.apiEndpoint}/pg/v1/pay`,
        {
          request: base64Payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'accept': 'application/json'
          }
        }
      );

      // Extract payment URL from response
      const paymentUrl = response.data.data.instrumentResponse.redirectInfo.url;
      
      return paymentUrl;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw new Error('Payment initiation failed');
    }
  }

  // Verify payment status
  async verifyPayment(params: PaymentVerificationParams): Promise<boolean> {
    try {
      const checksum = this.generateChecksum(
        `/pg/v1/status/${this.merchantId}/${params.merchantTransactionId}${this.saltKey}`
      );

      const response = await axios.get(
        `${this.apiEndpoint}/pg/v1/status/${this.merchantId}/${params.merchantTransactionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.merchantId
          }
        }
      );

      // Check payment status
      return response.data.code === 'PAYMENT_SUCCESS';
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  // Generate PhonePe checksum
  private generateChecksum(payload: string): string {
    const sha256Hash = crypto.createHash('sha256').update(payload).digest('hex');
    return `${sha256Hash}###1`;
  }

  // Refund payment
  async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    try {
      const merchantRefundId = `REFUND${transactionId}${Date.now()}`;
      
      const payloadData = {
        merchantId: this.merchantId,
        merchantTransactionId: merchantRefundId,
        originalTransactionId: transactionId,
        amount: amount * 100, // Convert to paisa
      };

      const base64Payload = Buffer.from(JSON.stringify(payloadData)).toString('base64');
      const checksum = this.generateChecksum(base64Payload);

      const response = await axios.post(
        `${this.apiEndpoint}/pg/v1/refund`,
        {
          request: base64Payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'accept': 'application/json'
          }
        }
      );

      return response.data.code === 'REFUND_SUCCESS';
    } catch (error) {
      console.error('Refund failed:', error);
      return false;
    }
  }
}

export default new PhonePePaymentService();
