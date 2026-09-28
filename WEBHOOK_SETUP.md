# Resend Webhook Setup Guide

## Overview

This document explains how to configure Resend webhooks to receive email delivery events for Lead Forge.

## Production Webhook URL

After deploying to your production server, add this URL to your Resend dashboard:

```
https://yourdomain.com/api/webhooks/resend
```

Replace `yourdomain.com` with your actual domain.

---

## Local Development with HTTPS Tunnel

To test webhooks locally, you need to expose your local server to the internet with HTTPS.

### Option 1: Using Cloudflare Tunnel (Recommended)

Cloudflare Tunnel provides free, secure HTTPS access to your local server.

#### Step-by-Step:

1. **Install Cloudflare Tunnel** (if not already installed):
   ```bash
   curl -L --cloudflare-login -o cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
   chmod +x cloudflared
   sudo mv cloudflared /usr/local/bin/
   ```

2. **Login to Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create a tunnel**:
   ```bash
   cloudflared tunnel create leadforge
   ```

4. **Start the webhook server** (in a separate terminal):
   ```bash
   npm run server
   ```
   Make sure `RESEND_WEBHOOK_SECRET` is set in your `.env` file.

5. **Create tunnel configuration** (`~/.cloudflared/config.yml`):
   ```yaml
   tunnel: leadforge
   credentials-file: ~/.cloudflared/abc123.json

   ingress:
     - hostname: your-subdomain.yourdomain.com
       service: http://localhost:54321
     - service: http_status:404
   ```

6. **Start the tunnel**:
   ```bash
   cloudflared tunnel run leadforge
   ```

7. **Configure in Resend**:
   - URL: `https://your-subdomain.yourdomain.com/api/webhooks/resend`
   - Events: sent, delivered, opened, clicked, bounced, failed, complained

### Option 2: Using ngrok

1. **Install ngrok**:
   ```bash
   # macOS with Homebrew
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start the webhook server** (in a separate terminal):
   ```bash
   npm run server
   ```

3. **Create ngrok tunnel**:
   ```bash
   ngrok http 54321
   ```

4. **Copy the HTTPS URL** from ngrok output:
   ```
   https://abc123.ngrok.io
   ```

5. **Configure in Resend**:
   - URL: `https://abc123.ngrok.io/api/webhooks/resend`
   - Events: sent, delivered, opened, clicked, bounced, failed, complained

### Option 3: Using Localtunnel

1. **Install localtunnel**:
   ```bash
   npm install -g localtunnel
   ```

2. **Start the webhook server** (in a separate terminal):
   ```bash
   npm run server
   ```

3. **Create tunnel**:
   ```bash
   lt --port 54321 --print-requests
   ```

4. **Copy the HTTPS URL**:
   ```
   https://abc123.loca.lt
   ```

5. **Configure in Resend**:
   - URL: `https://abc123.loca.lt/api/webhooks/resend`
   - Events: sent, delivered, opened, clicked, bounced, failed, complained

---

## Resend Dashboard Configuration

### Step 1: Go to Resend Dashboard
Navigate to [resend.com](https://resend.com) → Webhooks

### Step 2: Create New Webhook

**Webhook URL:**
```
https://yourdomain.com/api/webhooks/resend
```

**Events to subscribe:**
- ✅ `email.sent`
- ✅ `email.delivered`
- ✅ `email.opened`
- ✅ `email.clicked`
- ✅ `email.bounced`
- ✅ `email.failed`
- ✅ `email.complained`

**Signature Verification:**
The webhook endpoint automatically verifies the signature using `RESEND_WEBHOOK_SECRET` from your `.env` file.

---

## Webhook Payload Format

Resend sends JSON payloads like this:

```json
{
  "type": "email.delivered",
  "data": {
    "id": "email_id_123",
    "to": ["recipient@example.com"],
    "from": "sender@yourdomain.com",
    "subject": "Your Email Subject",
    "text": "Plain text content",
    "html": "<p>HTML content</p>",
    "status": "delivered",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "deliveredAt": "2024-01-15T12:00:05.000Z",
    "tags": [],
    "metadata": {}
  },
  "created_at": "2024-01-15T12:00:05.000Z"
}
```

---

## Event Handling

The webhook handler processes these events:

| Event Type | Action |
|------------|--------|
| `email.sent` | Marks email as "sent" |
| `email.delivered` | Marks email as "delivered", updates `delivered_at` |
| `email.opened` | Updates `opened_at`, increments `open_count` |
| `email.clicked` | Updates `clicked_at`, increments `click_count` |
| `email.bounced` | Marks email as "bounced", adds to suppression list |
| `email.failed` | Marks email as "failed" |
| `email.complained` | Marks as bounced, adds to spam suppression |

---

## Signature Verification

The webhook endpoint verifies signatures using HMAC-SHA256 with the `RESEND_WEBHOOK_SECRET`.

**In production, the signature format is:**
```
Resend-Webhook-Signature: t={timestamp},s={signature}
```

Where:
- `t` is the Unix timestamp
- `s` is the HMAC-SHA256 signature of `{timestamp}.{raw_body}`

---

## Testing the Webhook

### Test with Resend CLI
```bash
npm install -g @resend/cli
resend webhooks:send-test email.delivered
```

### Test with curl
```bash
curl -X POST https://yourdomain.com/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -H "Resend-Webhook-Signature: t=1700000000,s=test_signature" \
  -d '{
    "type": "email.delivered",
    "data": {
      "id": "test_email_id",
      "to": ["test@example.com"],
      "from": "sender@yourdomain.com",
      "status": "delivered"
    }
  }'
```

---

## Troubleshooting

### Issue: "Invalid signature" error

**Solution:** Make sure `RESEND_WEBHOOK_SECRET` is set correctly in your `.env` file and matches what's configured in Resend dashboard.

### Issue: Webhook not reaching server

**Solution:** 
1. Check that your server is running on port 54321
2. Verify your tunnel is active
3. Check firewall settings
4. Ensure HTTPS is used (Resend requires HTTPS for webhooks)

### Issue: Webhook shows "Delivered" but email not marked as delivered

**Solution:** Check that the `provider_message_id` in your `email_drafts` table matches the `data.id` from the webhook payload.

---

## Deployment Checklist

- [ ] Set `RESEND_WEBHOOK_SECRET` in production environment
- [ ] Configure webhook URL in Resend dashboard
- [ ] Enable HTTPS for webhook endpoint
- [ ] Test webhook with Resend test events
- [ ] Verify database updates occur on webhook receipt
- [ ] Monitor webhook logs for errors
