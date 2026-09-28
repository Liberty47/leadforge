# Lead Forge

**Find leads. Personalize outreach. Stay in control.**

Lead Forge is an AI-assisted lead generation and personalized cold-email CRM. The core philosophy is:

**Find leads → Research leads → Personalize emails with AI → Review → Approve → Send → Track delivery/activity → Notify me through external channels**

The AI must NEVER automatically send an email without your approval.

## Features

- ✅ **Lead Discovery**: Search and discover leads using Serper's Google search API
- ✅ **Campaign Management**: Create and manage email campaigns
- ✅ **AI Personalization**: Use OpenRouter to personalize emails with context
- ✅ **Review & Approval**: Critical review queue before sending emails
- ✅ **Email Sending**: Integrates with Resend for reliable email delivery
- ✅ **Delivery Tracking**: Track sent, delivered, opened, clicked, and replied emails
- ✅ **Activity Feed**: Monitor all campaign activities in real-time
- ✅ **External Notifications**: Telegram and WhatsApp notifications for key events
- ✅ **Settings**: Comprehensive settings for AI, email, notifications, and integrations
- ✅ **Responsive UI**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand, TanStack Query
- **Database**: Supabase (PostgreSQL + Realtime)
- **Authentication**: Supabase Auth
- **Email**: Resend API
- **Search**: Serper API
- **AI**: OpenRouter API (GPT-3.5, GPT-4, Claude, etc.)
- **Notifications**: Telegram Bot API, WhatsApp Business API

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd leadforge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

### 4. Configure environment variables

Edit `.env` and add your API keys:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SERPER_API_KEY=your-serper-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
RESEND_API_KEY=your-resend-api-key
RESEND_WEBHOOK_SECRET=your-resend-webhook-secret
FROM_EMAIL=no-reply@yourdomain.com
```

### 5. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migrations in `supabase/migrations/`:
   ```bash
   # Using Supabase SQL Editor
   # Or using supabase CLI:
   supabase db push
   ```
3. Copy your project URL and anon key to `.env`

### 6. Start the development server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## Demo Mode

If you don't have all API keys configured, the app will run in **Demo Mode** with:
- Mock lead search results
- Mock AI email generation
- Mock email sending

## Production Build

```bash
npm run build
npm run preview
```

## Security

- API keys are stored in environment variables
- No secrets are exposed to the frontend
- Row Level Security (RLS) is enabled on all database tables
- Emails require explicit approval before sending

## Webhooks

Configure Resend webhooks to receive email events:

```
POST /api/webhooks/resend
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the app with `npm run build` and serve the static files from `dist/`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev)
- UI components with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)
- Database by [Supabase](https://supabase.com)
- Email by [Resend](https://resend.com)
- Search by [Serper](https://serper.dev)
- AI by [OpenRouter](https://openrouter.ai)
