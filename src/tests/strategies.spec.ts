// tests/PaymentContext.test.ts
import { describe, it, expect, vi } from 'vitest';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../core/payments/PaymentTypes';
import { PaymentContext } from '../core/payments/strategies/PaymentContext';
import { PaymentStrategy } from '../core/payments/strategies/PaymentStrategy';

describe('PaymentContext', () => {
  it('usa la estrategia pasada en el constructor', async () => {
    const chargeInput = {} as ChargeInput;
    const refundInput = {} as RefundInput;

    const chargeResult = { id: 'c1' } as ChargeResult;
    const refundResult = { id: 'r1' } as RefundResult;

    const strategy: PaymentStrategy = {
      charge: vi.fn().mockResolvedValue(chargeResult),
      refund: vi.fn().mockResolvedValue(refundResult),
    };

    const ctx = new PaymentContext(strategy);

    const resultCharge = await ctx.charge(chargeInput);
    const resultRefund = await ctx.refund(refundInput);

    expect(strategy.charge).toHaveBeenCalledWith(chargeInput);
    expect(strategy.refund).toHaveBeenCalledWith(refundInput);
    expect(resultCharge).toBe(chargeResult);
    expect(resultRefund).toBe(refundResult);
  });

  it('permite cambiar de estrategia con setStrategy', async () => {
    const chargeInput = {} as ChargeInput;

    const firstStrategy: PaymentStrategy = {
      charge: vi.fn().mockResolvedValue({ id: 'first' } as ChargeResult),
      refund: vi.fn().mockResolvedValue({} as RefundResult),
    };

    const secondStrategy: PaymentStrategy = {
      charge: vi.fn().mockResolvedValue({ id: 'second' } as ChargeResult),
      refund: vi.fn().mockResolvedValue({} as RefundResult),
    };

    const ctx = new PaymentContext(firstStrategy);

    await ctx.charge(chargeInput); // usa la primera
    ctx.setStrategy(secondStrategy);
    const result = await ctx.charge(chargeInput); // usa la segunda

    expect(firstStrategy.charge).toHaveBeenCalledTimes(1);
    expect(secondStrategy.charge).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('second');
  });
});
