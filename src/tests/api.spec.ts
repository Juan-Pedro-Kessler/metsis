import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { routes } from '../api/routes';
import { PaymentService } from '../core/payments/facade/PaymentService';

vi.mock('../core/payments/facade/PaymentService', () => ({
  __esModule: true,
  PaymentService: {
    charge: vi.fn(),
    refund: vi.fn(),
  },
}));

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(routes);
  return app;
}

describe('API /payments', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  it('POST /payments/charge → 200 y responde lo que devuelve PaymentService.charge', async () => {
    (PaymentService.charge as any).mockResolvedValue({
      id: 'ch_123',
      status: 'approved',
    });

    const res = await request(app)
      .post('/payments/charge')
      .send({
        provider: 'stripe',
        amount: 1500,
        currency: 'ARS',
        token: 'tok_123',
      })
      .expect(200);

    expect(PaymentService.charge).toHaveBeenCalledTimes(1);
    expect(PaymentService.charge).toHaveBeenCalledWith(
      'stripe',
      {
        amount: 1500,
        currency: 'ARS',
        token: 'tok_123',
        metadata: undefined,
      }
    );

    expect(res.body).toEqual({
      id: 'ch_123',
      status: 'approved',
    });
  });

  it('POST /payments/charge → 400 por body inválido (falla schema) y NO llama a PaymentService', async () => {
    const res = await request(app)
      .post('/payments/charge')
      .send({
        provider: '', // inválido
        amount: 'abc', // inválido
      })
      .expect(400);

    expect(res.body).toHaveProperty('error', 'Datos inválidos');
    expect(PaymentService.charge).not.toHaveBeenCalled();
  });

  it('POST /payments/charge → 500 cuando PaymentService.charge lanza un error', async () => {
    (PaymentService.charge as any).mockRejectedValue(new Error('Service error'));

    const res = await request(app)
      .post('/payments/charge')
      .send({
        provider: 'stripe',
        amount: 1500,
        currency: 'ARS',
        token: 'tok_123',
      })
      .expect(500);

    expect(res.body).toEqual({ error: 'Service error' });
  });

  it('POST /payments/refund → 200 y responde lo que devuelve PaymentService.refund', async () => {
    (PaymentService.refund as any).mockResolvedValue({
      id: 're_123',
      status: 'refunded',
    });

    const res = await request(app)
      .post('/payments/refund')
      .send({
        provider: 'stripe',
        paymentId: 'ch_123',
        amount: 500,
      })
      .expect(200);

    expect(PaymentService.refund).toHaveBeenCalledTimes(1);
    expect(PaymentService.refund).toHaveBeenCalledWith(
      'stripe',
      {
        paymentId: 'ch_123',
        amount: 500,
      }
    );

    expect(res.body).toEqual({
      id: 're_123',
      status: 'refunded',
    });
  });
});
