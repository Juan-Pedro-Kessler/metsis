import { vi } from 'vitest';

export const StripeMock = {
  paymentIntents: {
    create: vi.fn().mockResolvedValue({
      id: 'pi_mock_123',
      status: 'succeeded',
      amount: 1000
    })
  }
};

export const resetStripeMocks = () => {
  StripeMock.paymentIntents.create.mockClear();
};