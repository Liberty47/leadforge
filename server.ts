import express from 'express'
import { Request, Response, NextFunction } from 'express'
import cors from 'cors'

// Custom middleware to capture raw body for webhook signature verification
const captureRawBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['content-type']?.includes('application/json')) {
    let rawBody = ''
    req.setEncoding('utf8')
    req.on('data', (chunk: string) => {
      rawBody += chunk
    })
    req.on('end', () => {
      ;(req as any).rawBody = rawBody
      next()
    })
  } else {
    next()
  }
}

const app = express()
const PORT = process.env.PORT || 54321

// Middleware
app.use(cors())
app.use(express.json())
app.use(captureRawBody)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'leadforge-webhooks'
  })
})

// Webhook endpoint for Resend
// Production URL: https://yourdomain.com/api/webhooks/resend
app.post('/api/webhooks/resend', async (req: Request, res: Response) => {
  const { webhookHandler } = await import('./src/webhooks.js')
  await webhookHandler.handleResendWebhook(req, res)
})

// Start server
app.listen(PORT, () => {
  console.log(`Lead Forge Webhook Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Resend webhook endpoint: http://localhost:${PORT}/api/webhooks/resend`)
  console.log(``)
  console.log(`For production, deploy to your server and configure in Resend dashboard:`)
  console.log(`  Webhook URL: https://yourdomain.com/api/webhooks/resend`)
  console.log(`  Sign with: ${process.env.RESEND_WEBHOOK_SECRET ? 'Signature verification enabled' : 'WARNING: No webhook secret configured'}`)
})

// Export for Vercel
export default app
export { app }
