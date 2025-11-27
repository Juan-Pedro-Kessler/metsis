// src/core/PaymentFactory.ts
import { PaymentStrategy } from '../strategies/PaymentStrategy';
import { StripeStrategy } from '../strategies/StripeStrategy';
import { MpStrategy } from '../strategies/MpStrategy';
import { StripeAdapter } from '../adapters/StripeAdapter';
import { MpAdapter } from '../adapters/MpAdapter';
import { createMockMpSdk, createMockStripeSdk } from '../../../mocks/paymentSdks';


export type Provider = 'stripe' | 'mp';

export type FactoryDeps = {
  stripeSdk?: any;
  mpSdk?: any;
};

export class PaymentFactory {
  static create(provider: Provider, deps?: FactoryDeps): PaymentStrategy {
    switch (provider) {
      case 'stripe':
        return new StripeStrategy(
          new StripeAdapter(deps?.stripeSdk ?? createMockStripeSdk()),
        );
      case 'mp':
        return new MpStrategy(
          new MpAdapter(deps?.mpSdk ?? createMockMpSdk()),
        );
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
