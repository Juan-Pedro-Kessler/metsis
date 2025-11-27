/**
 * Este test es para levantar el Coverage.
 */

import { describe, it, expect, vi } from 'vitest';
import { MpStrategy } from '../core/payments/strategies/MpStrategy';
import { MpAdapter } from '../core/payments/adapters/MpAdapter';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../core/payments/PaymentTypes';

describe('MpStrategy', () => {
  it('charge delega en adapter.pay y devuelve su resultado', async () => {
    const adapter: MpAdapter = {
      pay: vi.fn().mockResolvedValue({
        id: 'mp_ch_123',
        status: 'approved',
        amount: 1000,
        currency: 'ARS',
        provider: 'mp',
      } as ChargeResult),
      refund: vi.fn() as any, // no lo usamos en este test
    } as unknown as MpAdapter;

    const strategy = new MpStrategy(adapter);

    const input: ChargeInput = {
      amount: 1000,
      currency: 'ARS',
      token: 'tok_mp_123',
      metadata: { orderId: 'o1' },
    };

    const result = await strategy.charge(input);

    expect(adapter.pay).toHaveBeenCalledTimes(1);
    expect(adapter.pay).toHaveBeenCalledWith(input);
    expect(result.id).toBe('mp_ch_123');
    expect(result.provider).toBe('mp');
  });

  it('refund delega en adapter.refund y devuelve su resultado', async () => {
    const adapter: MpAdapter = {
      pay: vi.fn() as any,
      refund: vi.fn().mockResolvedValue({
        id: 'mp_re_123',
        status: 'refunded',
        amount: 500,
        currency: 'ARS',
        provider: 'mp',
      } as RefundResult),
    } as unknown as MpAdapter;

    const strategy = new MpStrategy(adapter);

    const input: RefundInput = {
      paymentId: 'mp_ch_123',
      amount: 500,
    };

    const result = await strategy.refund(input);

    expect(adapter.refund).toHaveBeenCalledTimes(1);
    expect(adapter.refund).toHaveBeenCalledWith(input);
    expect(result.id).toBe('mp_re_123');
    expect(result.status).toBe('refunded');
  });
});
