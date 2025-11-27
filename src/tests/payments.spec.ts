
import { describe, it, expect } from 'vitest';
import { PaymentFactory } from '../core/payments/factories/PaymentFactory';
import { RetryDecorator } from '../core/payments/decorators/RetryDecorator';
import { TelemetryDecorator } from '../core/payments/decorators/TelemetryDecorator';

describe('Payment Strategy + Decorators', () => {
  it('charge aprobado con stripe mock', async () => {
    const s = PaymentFactory.create('stripe');
    const wrapped = new TelemetryDecorator(new RetryDecorator(s), 'stripe');
    const out = await wrapped.charge({ amount: 1000, currency: 'ARS', token: 'tok_test' });
    expect(out.status).toBe('approved');
    expect(out.id).toMatch(/^st_|^mp_/);
  });

  it('refund aprobado con mp mock', async () => {
    const s = PaymentFactory.create('mp');
    const wrapped = new TelemetryDecorator(new RetryDecorator(s), 'mp');
    const out = await wrapped.refund({ paymentId: 'any', amount: 500 });
    expect(out.status).toBe('refunded');
  });
});
