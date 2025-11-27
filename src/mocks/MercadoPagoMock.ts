import { vi } from 'vitest';

export const MercadoPagoMock = {
  payment: {
    create: vi.fn().mockResolvedValue({
      id: 123456789,
      status: 'approved',
      transaction_amount: 1000
    })
  }
};

export const resetMercadoPagoMocks = () => {
  MercadoPagoMock.payment.create.mockClear();
};