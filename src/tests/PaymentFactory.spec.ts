// tests/PaymentFactory.spec.ts
import { describe, it, expect } from 'vitest';
import { Provider, PaymentFactory } from '../core/payments/factories/PaymentFactory';
import { MpStrategy } from '../core/payments/strategies/MpStrategy';
import { StripeStrategy } from '../core/payments/strategies/StripeStrategy';
import { createMockStripeSdk, createMockMpSdk } from '../mocks/paymentSdks';


describe('PaymentFactory', () => {
  it('crea un StripeStrategy cuando el provider es "stripe"', () => {
    const provider: Provider = 'stripe';

    const strategy = PaymentFactory.create(provider);

    expect(strategy).toBeInstanceOf(StripeStrategy);
  });

  it('crea un MpStrategy cuando el provider es "mp"', () => {
    const provider: Provider = 'mp';

    const strategy = PaymentFactory.create(provider);

    expect(strategy).toBeInstanceOf(MpStrategy);
  });

  it('permite inyectar un SDK custom para stripe', () => {
    const customStripeSdk = createMockStripeSdk();

    const strategy = PaymentFactory.create('stripe', {
      stripeSdk: customStripeSdk,
    });

    expect(strategy).toBeInstanceOf(StripeStrategy);
  });

  it('permite inyectar un SDK custom para mp', () => {
    const customMpSdk = createMockMpSdk();

    const strategy = PaymentFactory.create('mp', {
      mpSdk: customMpSdk,
    });

    expect(strategy).toBeInstanceOf(MpStrategy);
  });

  it('lanza error cuando el provider es desconocido', () => {
    const badProvider = 'paypal' as any;

    expect(() => PaymentFactory.create(badProvider)).toThrowError(
      /Unknown provider/,
    );
  });
});
