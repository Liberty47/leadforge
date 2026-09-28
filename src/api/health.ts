import { Request, Response } from 'express'

export function healthHandler(req: Request, res: Response) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'leadforge',
    version: '1.0.0'
  })
}
