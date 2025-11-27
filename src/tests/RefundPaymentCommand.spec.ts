import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RefundPaymentCommand } from '../core/commands/RefundPaymentCommand';
import type { RefundInput, RefundResult } from '../core/payments/PaymentTypes';
import type { PaymentStrategy } from '../core/payments/strategies/PaymentStrategy';
import { eventBus } from '../core/events/EventBus';

describe('RefundPaymentCommand', () => {
  const provider = 'stripe';

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(eventBus, 'emit').mockResolvedValue();
  });

  it('cuando el reembolso es exitoso (refunded) debe emitir PaymentRefunded', async () => {
    const input: RefundInput = {
      paymentId: 'pay_123',
      amount: 80,
    };

    const refundResult: RefundResult = {
      id: 'ref_999',
      status: 'refunded',
    } as RefundResult;

    const strategy = {
      refund: vi.fn().mockResolvedValue(refundResult),
    } as unknown as PaymentStrategy;

    const command = new RefundPaymentCommand(strategy, input, provider);

    const result = await command.execute();

    expect(strategy.refund).toHaveBeenCalledTimes(1);
    expect(strategy.refund).toHaveBeenCalledWith(input);

    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(eventBus.emit).toHaveBeenCalledWith('PaymentRefunded', {
      paymentId: refundResult.id,
      amount: input.amount,
      provider,
    });

    expect(result).toBe(refundResult);
  });

  it('si el reembolso no es "refunded" no debe emitir ningún evento', async () => {
    const input: RefundInput = {
      paymentId: 'pay_555',
    };

    const refundResult: RefundResult = {
      id: 'ref_000',
      status: 'failed',
    } as RefundResult;

    const strategy = {
      refund: vi.fn().mockResolvedValue(refundResult),
    } as unknown as PaymentStrategy;

    const command = new RefundPaymentCommand(strategy, input, provider);

    const result = await command.execute();

    expect(strategy.refund).toHaveBeenCalledWith(input);
    expect(eventBus.emit).not.toHaveBeenCalled();
    expect(result).toBe(refundResult);
  });
});
