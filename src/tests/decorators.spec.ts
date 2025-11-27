// tests/decorators.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';


// 👇 IMPORTANTE: el path debe coincidir EXACTAMENTE con el que usa tu TelemetryDecorator
vi.mock('../infra/logger', () => ({
  log: {
    info: vi.fn(),
  },
}));


import { log } from '../infra/logger';
import { RetryDecorator } from '../core/payments/decorators/RetryDecorator';
import { TelemetryDecorator } from '../core/payments/decorators/TelemetryDecorator';

beforeEach(() => {
  // Resetea contadores de los spies entre tests
  vi.clearAllMocks();
});

describe('RetryDecorator', () => {
  it('reintenta charge hasta tener éxito dentro del límite de reintentos', async () => {
    let attempts = 0;

    const inner = {
      charge: vi.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('fallo transitorio');
        }
        return { status: 'success' } as any;
      }),
      refund: vi.fn(),
    } as any;

    const retry = new RetryDecorator(inner, 2, 0); // 3 intentos, sin delay para tests

    const result = await retry.charge({} as any);

    expect(result.status).toBe('success');
    expect(inner.charge).toHaveBeenCalledTimes(3);
  });

  it('lanza el último error si se superan los reintentos', async () => {
    const inner = {
      charge: vi.fn(async () => {
        throw new Error('fallo definitivo');
      }),
      refund: vi.fn(),
    } as any;

    const retry = new RetryDecorator(inner, 2, 0); // 2 intentos

    await expect(retry.charge({} as any)).rejects.toThrow('fallo definitivo');
    expect(inner.charge).toHaveBeenCalledTimes(3);
  });
});

describe('TelemetryDecorator', () => {
  it('delegates en charge y loguea la operación', async () => {
    const inner = {
      charge: vi.fn(async () => ({ status: 'success' } as any)),
      refund: vi.fn(),
    } as any;

    const telemetry = new TelemetryDecorator(inner, 'stripe');

    const input = { amount: 1000 } as any;

    const out = await telemetry.charge(input);

    // delega correctamente
    expect(inner.charge).toHaveBeenCalledTimes(1);
    expect(inner.charge).toHaveBeenCalledWith(input);

    // loguea correctamente
    expect(log.info).toHaveBeenCalledTimes(1);
    expect(log.info).toHaveBeenCalledWith(
      expect.objectContaining({
        op: 'charge',
        provider: 'stripe',
        status: 'success',
      }),
    );

    expect(out.status).toBe('success');
  });

  it('delegates en refund y loguea la operación', async () => {
    const inner = {
      charge: vi.fn(),
      refund: vi.fn(async () => ({ status: 'refunded' } as any)),
    } as any;

    const telemetry = new TelemetryDecorator(inner, 'paypal');

    const input = { paymentId: 'abc123' } as any;

    const out = await telemetry.refund(input);

    // delega correctamente
    expect(inner.refund).toHaveBeenCalledTimes(1);
    expect(inner.refund).toHaveBeenCalledWith(input);

    // loguea correctamente
    expect(log.info).toHaveBeenCalledTimes(1);
    expect(log.info).toHaveBeenCalledWith(
      expect.objectContaining({
        op: 'refund',
        provider: 'paypal',
        status: 'refunded',
      }),
    );

    expect(out.status).toBe('refunded');
  });
});
