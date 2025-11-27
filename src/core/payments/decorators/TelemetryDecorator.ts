
import { PaymentStrategy } from '../strategies/PaymentStrategy';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../PaymentTypes';
import { log } from '../../../infra/logger';

export class TelemetryDecorator implements PaymentStrategy {
  constructor(private inner: PaymentStrategy, private provider: string) {}
  async charge(i: ChargeInput): Promise<ChargeResult> {
    const t0 = Date.now();
    const out = await this.inner.charge(i);
    log.info({ op: 'charge', provider: this.provider, ms: Date.now()-t0, status: out.status });
    return out;
  }
  async refund(i: RefundInput): Promise<RefundResult> {
    const t0 = Date.now();
    const out = await this.inner.refund(i);
    log.info({ op: 'refund', provider: this.provider, ms: Date.now()-t0, status: out.status });
    return out;
  }
}
