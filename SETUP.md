# Setup Guide - Career Analyzer

## 🚀 Quick Start

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the schema:
   - Copy contents from `supabase/schema.sql`
   - Paste and execute
4. Get your credentials:
   - Go to **Settings** → **API**
   - Copy `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY`

### 2. OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Go to **API Keys**
4. Create a new secret key
5. Copy the key → This is your `OPENAI_API_KEY`

**Important**: You need to add credits to your OpenAI account. The app uses GPT-4o which requires a paid account.

### 3. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Go to **Developers** → **API Keys**
3. Copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

4. Set up webhook (for local testing):
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks to local
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   
   Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

5. For production:
   - Go to **Developers** → **Webhooks**
   - Add endpoint: `https://your-domain.vercel.app/api/webhook`
   - Select event: `checkout.session.completed`
   - Copy the signing secret

### 4. Environment Variables

Create `.env.local` in project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the App

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Flow

### Test Free Analysis

1. Go to homepage
2. Paste sample resume text:
   ```
   Senior Full Stack Developer
   
   Experience: 5 years
   
   Tech Stack: React, Node.js, TypeScript, PostgreSQL, AWS
   
   Projects:
   - E-commerce platform with 1M+ users
   - Real-time chat application
   - Payment gateway integration
   ```
3. Click "무료 분석 시작"
4. You should see market scores for Australia and Korea

### Test Payment Flow (Test Mode)

1. After seeing scores, click "전체 리포트 구매하기"
2. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
3. Complete payment
4. You should be redirected back with full report

## 🌐 Deployment to Vercel

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables (same as `.env.local`)
5. Deploy

6. Update Stripe webhook:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-app.vercel.app/api/webhook`
   - Select event: `checkout.session.completed`
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel

7. Update `NEXT_PUBLIC_APP_URL` in Vercel to your production URL

## 💰 Cost Estimates

### Development/Testing
- Supabase: **Free** (500MB database, 50K monthly active users)
- Vercel: **Free** (100GB bandwidth, unlimited requests)
- Stripe: **Free** (no monthly fee, only transaction fees)
- OpenAI: **~$0.01-0.05 per analysis** (GPT-4o pricing)

### Production (100 users/month)
- Supabase: **Free tier sufficient**
- Vercel: **Free tier sufficient**
- Stripe: **2.9% + $0.30 per transaction**
- OpenAI: **~$5-10/month** (depends on usage)

**Total monthly cost**: ~$5-15 for 100 analyses

## 🐛 Troubleshooting

### "Failed to analyze resume"
- Check OpenAI API key is valid
- Ensure you have credits in OpenAI account
- Check API usage limits

### "Failed to save analysis"
- Verify Supabase credentials
- Check database schema is created
- Verify RLS policies are set

### Stripe webhook not working
- For local: Make sure `stripe listen` is running
- For production: Verify webhook URL is correct
- Check webhook signing secret matches

### PDF upload not working
- Ensure file is valid PDF
- Check file size (should be < 10MB)
- Try pasting text instead

## 📞 Support

For issues, check:
1. Browser console for errors
2. Vercel logs (if deployed)
3. Supabase logs
4. Stripe dashboard for payment issues

## 🎯 Next Steps

After basic setup works:
1. Customize the AI prompts in `lib/agents/`
2. Adjust pricing in `app/api/checkout/route.ts`
3. Add analytics (Google Analytics, Posthog, etc.)
4. Add email notifications (Resend, SendGrid)
5. Add user authentication (Supabase Auth)
6. Improve PDF generation (use proper PDF library)
