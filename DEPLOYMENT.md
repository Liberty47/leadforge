# Lead Forge Deployment Guide

## Deploying to Vercel

### Prerequisites

1. A Vercel account (free tier available)
2. Your project code pushed to GitHub
3. API keys ready to configure

---

## Step 1: Prepare Your Project

### Update package.json for Vercel

Your `package.json` already includes the necessary scripts.

### Configure Environment Variables for Vercel

You'll need to add these to the Vercel dashboard:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-side only) |
| `SERPER_API_KEY` | Your Serper API key |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_WEBHOOK_SECRET` | Your Resend webhook secret |
| `FROM_EMAIL` | The email address emails come from |

---

## Step 2: Create a Vercel Project

### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit - Lead Forge"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd /home/libera/Desktop/leadforge
   vercel
   ```

---

## Step 3: Configure Environment Variables in Vercel

In the Vercel dashboard, go to:
**Settings** → **Environment Variables**

Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://mbczyctvorieaogfktxu.supabase.co` | Production |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` (your anon key) | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` (your service role key) | Production |
| `SERPER_API_KEY` | `your-serper-key` | Production |
| `OPENROUTER_API_KEY` | `your-openrouter-key` | Production |
| `RESEND_API_KEY` | `re_...` (your resend key) | Production |
| `RESEND_WEBHOOK_SECRET` | `your-webhook-secret` | Production |
| `FROM_EMAIL` | `no-reply@leadforge.app` | Production |

**Important:** Make sure to add the server-side keys (`SUPABASE_SERVICE_ROLE_KEY`, `SERPER_API_KEY`, etc.) as **Server Environment Variables** in Vercel.

---

## Step 4: Configure Vercel Project Settings

In the Vercel dashboard, go to **Settings** → **Build & Development Settings**:

| Setting | Value |
|---------|-------|
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Step 5: Set Up Webhook URL

After deployment, your webhook URL will be:

```
https://your-app.vercel.app/api/webhooks/resend
```

### Configure in Resend Dashboard

1. Go to [resend.com](https://resend.com) → Webhooks
2. Click "Create Webhook"
3. Set the URL to: `https://your-app.vercel.app/api/webhooks/resend`
4. Select events: `sent`, `delivered`, `opened`, `clicked`, `bounced`, `failed`, `complained`
5. Click "Create"

---

## Step 6: Deploy

### Using Vercel Dashboard

1. Go to your project in Vercel
2. Click "Deploy" or push to your main branch (auto-deploys)

### Using CLI

```bash
vercel --prod
```

---

## Step 7: Test Your Deployment

1. **Test the health endpoint:**
   ```
   https://your-app.vercel.app/health
   ```

2. **Test the webhook endpoint:**
   Use Resend's webhook test feature or curl:
   ```bash
   curl -X POST https://your-app.vercel.app/api/webhooks/resend \
     -H "Content-Type: application/json" \
     -H "Resend-Webhook-Signature: t=1700000000,s=test" \
     -d '{"type":"email.delivered","data":{"id":"test","status":"delivered"}}'
   ```

3. **Test the app:**
   ```
   https://your-app.vercel.app
   ```

---

## Environment Variable Types in Vercel

Vercel distinguishes between:

| Type | Description | Visibility |
|------|-------------|------------|
| **Environment Variable** | Available to both server and client | Client-side accessible |
| **Server Environment Variable** | Only available to server-side code | Not accessible to browser |
| **Secret Environment Variable** | Encrypted, server-only | Not accessible to browser |

**Recommendation:** Set all your API keys as **Secret Environment Variables** in Vercel.

---

## Troubleshooting

### Issue: "404 Not Found" on pages

**Solution:** Make sure your `vercel.json` has proper routing rules for React Router.

### Issue: "API routes are not supported"

**Solution:** Ensure you have the correct Vercel configuration for serverless functions.

### Issue: "Supabase connection failed"

**Solution:** Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set in Vercel.

### Issue: "Resend webhook signature invalid"

**Solution:** Make sure `RESEND_WEBHOOK_SECRET` matches what's configured in the Resend dashboard.

---

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Webhook URL configured in Resend dashboard
- [ ] Supabase migrations run
- [ ] Domain configured (custom domain or Vercel default)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Health check endpoint working
- [ ] Webhook endpoint verified
- [ ] App deployed and accessible

---

## Post-Deployment

After deploying:

1. Test the activation screen
2. Verify Supabase connection
3. Test lead search
4. Test campaign creation
5. Test email sending workflow
6. Configure domain and SSL (automatic on Vercel)
7. Set up custom domain if desired

Your Lead Forge application is now live on Vercel!
