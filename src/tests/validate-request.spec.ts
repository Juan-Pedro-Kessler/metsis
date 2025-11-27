// tests/validate-request.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validate-request';

function mockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe('validateRequest middleware', () => {
  const schema = z.object({
    amount: z.number(),
  });

  it('llama a next() cuando el body es válido', () => {
    const req = { body: { amount: 100 } } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    const mw = validateRequest(schema);
    mw(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responde 400 cuando el body es inválido', () => {
    const req = { body: { amount: 'no-numero' } } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    const mw = validateRequest(schema);
    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
