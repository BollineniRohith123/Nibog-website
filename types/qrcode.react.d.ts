declare module 'qrcode.react' {
  import React from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }

  export default class QRCode extends React.Component<QRCodeProps> {}
}
