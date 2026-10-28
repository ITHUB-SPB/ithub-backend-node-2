import type { Response } from 'express';

export function formatSuccess(res: Response, data: any, meta?: any, status = 200) {
  return res.status(status).json({ 
    status: 'success', 
    data, 
    meta 
  });
}

export function formatError(res: Response, message: string, status = 400, errors?: any) {
  return res.status(status).json({ 
    status: 'error', 
    message, 
    errors 
  });
}