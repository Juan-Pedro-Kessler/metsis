// Tipos existentes que me pasaste
export type ChargeInput = {
  amount: number;
  currency: "ARS" | "USD";
  token: string;
  metadata?: Record<string, string>;
};

export type ChargeResult = {
  id: string;
  status: "approved" | "declined";
  raw?: unknown;
};

export type RefundInput = { 
  paymentId: string; 
  amount?: number 
};

export type RefundResult = {
  id: string;
  status: "refunded" | "failed";
  raw?: unknown;
};

// Nuevos tipos necesarios para los patrones de diseño
export interface PaymentMethod {
  processPayment(amount: number, details: ChargeInput): Promise<ChargeResult>;
}

export interface PaymentAdapter {
  charge(input: ChargeInput): Promise<ChargeResult>;
  refund(input: RefundInput): Promise<RefundResult>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  amount: number;
  timestamp: Date;
}

// Enums para mejor organización
export enum PaymentProviders {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  MERCADOPAGO = 'mercadopago'
}

export enum PaymentEvents {
  PAYMENT_CREATED = 'payment:created',
  PAYMENT_PROCESSED = 'payment:processed',
  PAYMENT_FAILED = 'payment:failed',
  PAYMENT_REFUNDED = 'payment:refunded'
}

// Tipos para el Event Bus
export type PaymentEventData = {
  paymentId: string;
  amount: number;
  currency: string;
  provider: PaymentProviders;
  status: string;
  timestamp: Date;
};

// Tipos para Commands
export type ProcessPaymentCommand = {
  type: 'PROCESS_PAYMENT';
  payload: ChargeInput & { provider: PaymentProviders };
};

export type RefundPaymentCommand = {
  type: 'REFUND_PAYMENT';
  payload: RefundInput;
};

export type PaymentCommand = ProcessPaymentCommand | RefundPaymentCommand;

// Factory types
export type PaymentConfig = {
  apiKey: string;
  environment: 'sandbox' | 'production';
  timeout?: number;
};

// Strategy types
export type PaymentStrategy = {
  executePayment(chargeInput: ChargeInput): Promise<ChargeResult>;
  executeRefund(refundInput: RefundInput): Promise<RefundResult>;
};

// Decorator types
export type PaymentDecorator = {
  process(chargeInput: ChargeInput): Promise<ChargeResult>;
  refund(refundInput: RefundInput): Promise<RefundResult>;
};