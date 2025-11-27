export type EventName = "PaymentCaptured" | "PaymentRefunded" | "PaymentFailed";

export type EventPayloads = {
  PaymentCaptured: { paymentId: string; amount: number; provider: string };
  PaymentRefunded: { paymentId: string; amount: number; provider: string };
  PaymentFailed: { reason: string; provider: string };
};

type Handler<K extends EventName> = (p: EventPayloads[K]) => void | Promise<void>;

export class EventBus {
 
  private handlers: { [K in EventName]?: Array<Handler<any>> } = {};

  on<K extends EventName>(name: K, h: Handler<K>) {
 
    const arr = (this.handlers[name] ??= []) as Handler<K>[];
    arr.push(h);
  }

  async emit<K extends EventName>(name: K, payload: EventPayloads[K]) {
    const arr = (this.handlers[name] ?? []) as Handler<K>[];
    for (const h of arr) await h(payload);
  }
}

export const eventBus = new EventBus();
