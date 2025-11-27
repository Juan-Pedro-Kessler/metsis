
import pino from 'pino';
class Logger {
  private static _i: pino.Logger;
  static get i() { return (this._i ??= pino({ level: process.env.LOG_LEVEL ?? 'info' })); }
}
export const log = Logger.i;
