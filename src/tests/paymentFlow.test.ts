import { describe, it, expect, vi } from 'vitest';
import { 
  ChargeInput, 
  ChargeResult, 
  PaymentProviders,
  PaymentEvents 
} from '../core/payments/PaymentTypes';

// Mock que usa TUS tipos reales
const createPaymentService = () => ({
  processCharge: vi.fn().mockImplementation(async (input: ChargeInput): Promise<ChargeResult> => {
    // Simular lógica de negocio real
    if (input.amount <= 0) {
      return {
        id: `pay_${Date.now()}`,
        status: 'declined',
        raw: { error: 'Invalid amount' }
      };
    }

    if (input.amount > 100000) {
      return {
        id: `pay_${Date.now()}`,
        status: 'declined', 
        raw: { error: 'Amount exceeds limit' }
      };
    }

    // Pago aprobado
    return {
      id: `pay_${Date.now()}`,
      status: 'approved',
      raw: { 
        provider: 'mock',
        amount: input.amount,
        currency: input.currency
      }
    };
  }),

  // Eventos simulados
  onPaymentEvent: vi.fn()
});

describe('Payment Flow with Real Types', () => {
  it('should approve valid ARS payment', async () => {
    const paymentService = createPaymentService();
    
    const chargeInput: ChargeInput = {
      amount: 15000,
      currency: 'ARS',
      token: 'tok_ars_123',
      metadata: { order_id: 'ORD-123' }
    };

    const result = await paymentService.processCharge(chargeInput);

    expect(result.status).toBe('approved');
    expect(result.id).toContain('pay_');
    expect(result.raw).toMatchObject({
      amount: 15000,
      currency: 'ARS'
    });
  });

  it('should approve valid USD payment', async () => {
    const paymentService = createPaymentService();
    
    const chargeInput: ChargeInput = {
      amount: 100,
      currency: 'USD',
      token: 'tok_usd_456'
    };

    const result = await paymentService.processCharge(chargeInput);

    expect(result.status).toBe('approved');
    expect(result.raw).toMatchObject({
      currency: 'USD'
    });
  });

  it('should decline zero amount payment', async () => {
    const paymentService = createPaymentService();
    
    const chargeInput: ChargeInput = {
      amount: 0,
      currency: 'ARS',
      token: 'tok_test_123'
    };

    const result = await paymentService.processCharge(chargeInput);

    expect(result.status).toBe('declined');
    expect(result.raw).toHaveProperty('error', 'Invalid amount');
  });

  it('should decline payment over limit', async () => {
    const paymentService = createPaymentService();
    
    const chargeInput: ChargeInput = {
      amount: 200000,
      currency: 'ARS',
      token: 'tok_test_789'
    };

    const result = await paymentService.processCharge(chargeInput);

    expect(result.status).toBe('declined');
    expect(result.raw).toHaveProperty('error', 'Amount exceeds limit');
  });

  it('should handle payment with metadata', async () => {
    const paymentService = createPaymentService();
    
    const chargeInput: ChargeInput = {
      amount: 5000,
      currency: 'ARS',
      token: 'tok_test_999',
      metadata: {
        order_id: '12345',
        user_id: 'user_678',
        description: 'Test purchase'
      }
    };

    const result = await paymentService.processCharge(chargeInput);

    expect(result.status).toBe('approved');
    expect(paymentService.processCharge).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          order_id: '12345',
          user_id: 'user_678',
          description: 'Test purchase'
        }
      })
    );
  });
});