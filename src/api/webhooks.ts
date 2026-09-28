import { Request, Response } from 'express'
import { webhookHandler } from '../webhooks.js'

export async function handleResendWebhook(req: Request, res: Response) {
  await webhookHandler.handleResendWebhook(req, res)
}
