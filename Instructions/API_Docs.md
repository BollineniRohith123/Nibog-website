# NIBOG Event Booking Website - Detailed API Documentation

## 1. Authentication APIs

### 1.1 User Registration
- **Endpoint:** `/api/auth/register`
- **Method:** POST
- **Request Body:**
```typescript
interface UserRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}
```
- **Response:**
```typescript
interface UserRegistrationResponse {
  userId: string;
  email: string;
  token: string;
  success: boolean;
}
```

### 1.2 User Login
- **Endpoint:** `/api/auth/login`
- **Method:** POST
- **Request Body:**
```typescript
interface UserLoginRequest {
  email: string;
  password: string;
}
```
- **Response:**
```typescript
interface UserLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
  success: boolean;
}
```

## 2. Event APIs

### 2.1 List Events
- **Endpoint:** `/api/events`
- **Method:** GET
- **Query Parameters:**
  - `city?: string`
  - `date?: string`
  - `ageGroup?: string`
- **Response:**
```typescript
interface EventListResponse {
  events: Array<{
    id: string;
    name: string;
    city: string;
    date: string;
    ageCategories: Array<{
      name: string;
      price: number;
      maxCapacity: number;
    }>;
    availableSlots: number;
  }>;
  total: number;
}
```

### 2.2 Get Event Details
- **Endpoint:** `/api/events/:eventId`
- **Method:** GET
- **Response:**
```typescript
interface EventDetailResponse {
  id: string;
  name: string;
  description: string;
  city: string;
  date: string;
  startTime: string;
  endTime: string;
  ageCategories: Array<{
    name: string;
    price: number;
    maxCapacity: number;
    currentRegistrations: number;
  }>;
  games: Array<{
    id: string;
    name: string;
    description: string;
    ageRange: string;
  }>;
}
```

## 3. Registration APIs

### 3.1 Create Registration
- **Endpoint:** `/api/registrations`
- **Method:** POST
- **Request Body:**
```typescript
interface RegistrationRequest {
  eventId: string;
  gameId: string;
  childName: string;
  childAge: number;
  parentName: string;
  parentContact: string;
  ageCategory: string;
}
```
- **Response:**
```typescript
interface RegistrationResponse {
  registrationId: string;
  status: 'pending' | 'confirmed';
  paymentLink?: string;
}
```

### 3.2 Get User Registrations
- **Endpoint:** `/api/registrations/user`
- **Method:** GET
- **Response:**
```typescript
interface UserRegistrationsResponse {
  registrations: Array<{
    id: string;
    eventName: string;
    date: string;
    childName: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
  }>;
}
```

## 4. Payment APIs

### 4.1 Initiate Payment
- **Endpoint:** `/api/payments/initiate`
- **Method:** POST
- **Request Body:**
```typescript
interface PaymentInitiateRequest {
  registrationId: string;
  amount: number;
  currency: string;
}
```
- **Response:**
```typescript
interface PaymentInitiateResponse {
  paymentId: string;
  status: 'initiated';
  redirectUrl: string;
}
```

### 4.2 Verify Payment
- **Endpoint:** `/api/payments/verify`
- **Method:** POST
- **Request Body:**
```typescript
interface PaymentVerifyRequest {
  paymentId: string;
  registrationId: string;
}
```
- **Response:**
```typescript
interface PaymentVerifyResponse {
  status: 'success' | 'failed';
  registrationStatus: 'confirmed' | 'cancelled';
}
```

## 5. Admin APIs

### 5.1 Create Event
- **Endpoint:** `/api/admin/events`
- **Method:** POST
- **Request Body:**
```typescript
interface CreateEventRequest {
  name: string;
  description: string;
  cityId: string;
  date: string;
  startTime: string;
  endTime: string;
  ageCategories: Array<{
    name: string;
    price: number;
    maxCapacity: number;
  }>;
}
```

### 5.2 Get Event Registrations
- **Endpoint:** `/api/admin/registrations`
- **Method:** GET
- **Query Parameters:**
  - `eventId?: string`
  - `status?: 'pending' | 'completed'`
- **Response:**
```typescript
interface AdminRegistrationsResponse {
  registrations: Array<{
    id: string;
    eventName: string;
    childName: string;
    parentContact: string;
    paymentStatus: string;
  }>;
  total: number;
}
```

## API Testing Strategy

### Test Case Examples

1. **Authentication Flow Test**
```typescript
describe('Authentication API', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'StrongPassword123!',
        firstName: 'Test',
        lastName: 'User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('token');
  });

  it('should login user with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'StrongPassword123!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

2. **Event Registration Flow Test**
```typescript
describe('Event Registration API', () => {
  it('should create a registration successfully', async () => {
    const response = await request(app)
      .post('/api/registrations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        eventId: 'event123',
        gameId: 'game456',
        childName: 'Test Child',
        childAge: 1,
        parentName: 'Test Parent',
        parentContact: '1234567890',
        ageCategory: '0-1 year'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('registrationId');
    expect(response.body.status).toBe('pending');
  });
});
```

### Recommended Testing Tools
- **Postman/Insomnia:** For manual API testing
- **Jest:** For unit and integration testing
- **Cypress:** For end-to-end testing
- **Swagger/OpenAPI:** For API documentation and testing

### Best Practices
1. Always use environment variables for sensitive information
2. Implement comprehensive error handling
3. Use middleware for authentication and authorization
4. Validate and sanitize all input data
5. Implement rate limiting and other security measures
