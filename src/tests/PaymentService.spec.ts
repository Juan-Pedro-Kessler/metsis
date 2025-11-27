import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../core/payments/factories/PaymentFactory', () => {
  return {PaymentFactory: {
    create: vi.fn(),
  },
}
});

vi.mock('../core/commands/CommandBus', () => {
  return {commandBus: {
    dispatch: vi.fn(),
  },
}
});


import { PaymentService } from '../core/payments/facade/PaymentService';
import { commandBus } from '../core/commands/CommandBus';
import { CapturePaymentCommand } from '../core/commands/CapturePaymentCommand';
import { RefundPaymentCommand } from '../core/commands/RefundPaymentCommand';
import { PaymentFactory } from '../core/payments/factories/PaymentFactory';

describe('PaymentService (Facade)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('charge: usa PaymentFactory y commandBus correctamente', async () => {
    const provider = 'stripe' as any;
    const input = { amount: 100, currency: 'usd' } as any;

    // ⚙️ Obtenemos las funciones mockeadas desde los imports
    const factoryCreateMock = PaymentFactory.create as unknown as vi.Mock;
    const dispatchMock = commandBus.dispatch as unknown as vi.Mock;

    const fakeStrategy = { charge: vi.fn(), refund: vi.fn() };
    factoryCreateMock.mockReturnValueOnce(fakeStrategy);

    const expectedResult = { id: 'payment-123' };
    dispatchMock.mockResolvedValueOnce(expectedResult);

    const result = await PaymentService.charge(provider, input);

    // ✅ Se llama al factory con el provider
    expect(factoryCreateMock).toHaveBeenCalledTimes(1);
    expect(factoryCreateMock).toHaveBeenCalledWith(provider);

    // ✅ Se hace un dispatch con un CapturePaymentCommand
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    const dispatchedCommand = dispatchMock.mock.calls[0][0];

    expect(dispatchedCommand).toBeInstanceOf(CapturePaymentCommand);
    // (Opcional: si las props son públicas)
    // @ts-expect-error si son privadas
    expect(dispatchedCommand.provider).toBe(provider);
    // @ts-expect-error
    expect(dispatchedCommand.input).toBe(input);

    // ✅ El resultado es lo que devuelve el bus
    expect(result).toEqual(expectedResult);
  });

  it('refund: usa PaymentFactory y commandBus correctamente', async () => {
    const provider = 'mp' as any;
    const input = { paymentId: 'pay_1', amount: 50 } as any;

    const factoryCreateMock = PaymentFactory.create as unknown as vi.Mock;
    const dispatchMock = commandBus.dispatch as unknown as vi.Mock;

    const fakeStrategy = { charge: vi.fn(), refund: vi.fn() };
    factoryCreateMock.mockReturnValueOnce(fakeStrategy);

    const expectedResult = { id: 'refund-999' };
    dispatchMock.mockResolvedValueOnce(expectedResult);

    const result = await PaymentService.refund(provider, input);

    // ✅ Se llama al factory con el provider
    expect(factoryCreateMock).toHaveBeenCalledTimes(1);
    expect(factoryCreateMock).toHaveBeenCalledWith(provider);

    // ✅ Se hace un dispatch con un RefundPaymentCommand
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    const dispatchedCommand = dispatchMock.mock.calls[0][0];

    expect(dispatchedCommand).toBeInstanceOf(RefundPaymentCommand);
    // @ts-expect-error si son privadas
    expect(dispatchedCommand.provider).toBe(provider);
    // @ts-expect-error
    expect(dispatchedCommand.input).toBe(input);

    // ✅ El resultado coincide con lo del bus
    expect(result).toEqual(expectedResult);
  });
});
