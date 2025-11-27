// tests/EventBus.test.ts
import { describe, it, expect, vi } from 'vitest';
import { EventBus, eventBus } from '../core/events/EventBus';


describe('EventBus (clase)', () => {
  it('registra y ejecuta un handler síncrono', async () => {
    const bus = new EventBus();

    const handler = vi.fn();

    bus.on('PaymentCaptured', handler);

    const payload = { paymentId: 'abc', amount: 100, provider: 'stripe' };
    await bus.emit('PaymentCaptured', payload);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(payload);
  });

  it('permite múltiples handlers para el mismo evento', async () => {
    const bus = new EventBus();

    const handler1 = vi.fn();
    const handler2 = vi.fn();

    bus.on('PaymentRefunded', handler1);
    bus.on('PaymentRefunded', handler2);

    const payload = { paymentId: 'p-1', amount: 50, provider: 'paypal' };
    await bus.emit('PaymentRefunded', payload);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith(payload);
    expect(handler2).toHaveBeenCalledWith(payload);
  });

  it('no dispara handlers de otros eventos', async () => {
    const bus = new EventBus();

    const capturedHandler = vi.fn();
    const failedHandler = vi.fn();

    bus.on('PaymentCaptured', capturedHandler);
    bus.on('PaymentFailed', failedHandler);

    const payloadCaptured = { paymentId: 'p-2', amount: 200, provider: 'stripe' };
    await bus.emit('PaymentCaptured', payloadCaptured);

    expect(capturedHandler).toHaveBeenCalledTimes(1);
    expect(failedHandler).not.toHaveBeenCalled();
  });

  it('espera handlers asíncronos', async () => {
    const bus = new EventBus();

    const asyncHandler = vi.fn(async () => {
      // simulamos una operación async
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    bus.on('PaymentFailed', asyncHandler);

    const payload = { reason: 'card_declined', provider: 'stripe' };
    await bus.emit('PaymentFailed', payload);

    expect(asyncHandler).toHaveBeenCalledTimes(1);
    expect(asyncHandler).toHaveBeenCalledWith(payload);
  });
});

describe('eventBus (singleton exportado)', () => {
  it('funciona con la instancia compartida', async () => {
    const handler = vi.fn();

    eventBus.on('PaymentCaptured', handler);

    const payload = { paymentId: 'shared-1', amount: 300, provider: 'mercadopago' };
    await eventBus.emit('PaymentCaptured', payload);

    expect(handler).toHaveBeenCalledWith(payload);
  });
});
