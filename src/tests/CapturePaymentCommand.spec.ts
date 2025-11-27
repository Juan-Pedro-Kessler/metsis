import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CapturePaymentCommand } from '../core/commands/CapturePaymentCommand'; // ajusta ruta
import type { ChargeInput, ChargeResult } from '../core/payments/PaymentTypes';
import type { PaymentStrategy } from '../core/payments/strategies/PaymentStrategy';
import { eventBus } from '../core/events/EventBus'; // usa misma ruta que en el comando

describe('CapturePaymentCommand', () => {
  const provider = 'stripe';

  beforeEach(() => {
    vi.restoreAllMocks();
    // Convertimos emit en un spy y evitamos que ejecute lógica real
    vi.spyOn(eventBus, 'emit').mockResolvedValue();
  });

  it('cuando el pago es aprobado debe llamar a strategy.charge y emitir PaymentCaptured', async () => {
    const input: ChargeInput = {
      amount: 100,
      currency: "USD",
      token : 'chi_1224'
    };

    const chargeResult: ChargeResult = {
      id: 'pay_123',
      status: 'approved',
    } as ChargeResult;

    const strategy = {
      charge: vi.fn().mockResolvedValue(chargeResult),
    } as unknown as PaymentStrategy;

    const command = new CapturePaymentCommand(strategy, input, provider);

    const result = await command.execute();

    expect(strategy.charge).toHaveBeenCalledTimes(1);
    expect(strategy.charge).toHaveBeenCalledWith(input);

    // Ahora sí: emit es un spy
    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(eventBus.emit).toHaveBeenCalledWith('PaymentCaptured', {
      paymentId: chargeResult.id,
      amount: input.amount,
      provider,
    });

    expect(result).toBe(chargeResult);
  });

  it('cuando el pago es rechazado debe emitir PaymentFailed', async () => {
    const input: ChargeInput = {
      amount: 100,
      currency: "USD",
      token : 'chi_1224'
    };


    const chargeResult: ChargeResult = {
      id: 'pay_456',
      status: 'declined',
    } as ChargeResult;

    const strategy = {
      charge: vi.fn().mockResolvedValue(chargeResult),
    } as unknown as PaymentStrategy;

    const command = new CapturePaymentCommand(strategy, input, provider);

    const result = await command.execute();

    expect(strategy.charge).toHaveBeenCalledWith(input);

    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(eventBus.emit).toHaveBeenCalledWith('PaymentFailed', {
      reason: 'declined',
      provider,
    });

    expect(result).toBe(chargeResult);
  });
});
