# Career Analyzer - 한국 vs 호주 취업 분석 SaaS

AI-powered career analysis tool that helps tech professionals evaluate their job market fit in South Korea vs Australia.

## 🎯 Features

- **Resume Analysis**: Upload PDF or paste text to extract tech stack, experience, and projects
- **Market Scoring**: AI-powered scoring (0-100) for Korea and Australia markets
- **Strategy Report**: Comprehensive report with:
  - Market fit analysis
  - Risk factors
  - Salary predictions (AUD & KRW)
  - Skill gap analysis
  - 90-day action plan
- **Payment Integration**: Stripe checkout for premium reports ($29)

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o
- **Payment**: Stripe
- **PDF**: pdf-parse, jsPDF
- **File Upload**: react-dropzone

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Duru2/NicoPilot.git
cd NicoPilot
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a \`.env.local\` file with:
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

4. Set up Supabase:
- Create a new Supabase project
- Run the SQL in \`supabase/schema.sql\` in the SQL Editor

5. Set up Stripe:
- Create a Stripe account
- Get your API keys from the dashboard
- Set up a webhook endpoint pointing to \`/api/webhook\`

## 🚀 Development

Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
career-analyzer/
├── app/
│   ├── api/
│   │   ├── analyze/          # Resume analysis endpoint
│   │   ├── analysis/[id]/    # Get analysis by ID
│   │   ├── checkout/         # Stripe checkout
│   │   ├── extract-pdf/      # PDF text extraction
│   │   └── webhook/          # Stripe webhook handler
│   ├── results/[id]/         # Results page
│   └── page.tsx              # Landing page
├── lib/
│   ├── agents/
│   │   ├── resume-parser.ts  # AI resume parser
│   │   ├── market-scorer.ts  # Market scoring logic
│   │   └── report-generator.ts # Report generation
│   ├── openai.ts             # OpenAI client
│   ├── stripe.ts             # Stripe client
│   ├── supabase.ts           # Supabase client
│   └── pdf-utils.ts          # PDF utilities
├── types/
│   └── index.ts              # TypeScript types
└── supabase/
    └── schema.sql            # Database schema
\`\`\`

## 🎨 User Flow

1. **Upload Resume**: User uploads PDF or pastes text
2. **Free Analysis**: AI analyzes and shows market scores (free)
3. **Paywall**: User sees score but needs to pay for full report
4. **Payment**: Stripe checkout ($29)
5. **Full Report**: After payment, full strategy report is generated
6. **Download**: User can download PDF report

## 🔑 Key Components

### AI Agents

1. **Resume Parser**: Extracts structured data from resume text
2. **Market Scorer**: Calculates fit scores for each market
3. **Report Generator**: Creates comprehensive strategy report

### API Routes

- \`POST /api/analyze\`: Analyze resume and return scores
- \`GET /api/analysis/[id]\`: Get analysis by ID
- \`POST /api/checkout\`: Create Stripe checkout session
- \`POST /api/webhook\`: Handle Stripe payment webhooks
- \`POST /api/extract-pdf\`: Extract text from PDF

## 🌐 Deployment

### Vercel (Recommended - Free)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables on Vercel

Add all variables from \`.env.local\` to Vercel project settings.

### Stripe Webhook

After deploying, update your Stripe webhook URL to:
\`\`\`
https://your-domain.vercel.app/api/webhook
\`\`\`

## 💰 Pricing

- **Free**: Market scores and basic profile analysis
- **Premium ($29)**: Full strategy report with action plan

## 📝 License

MIT

## 🤝 Contributing

This is a personal side project. Feel free to fork and modify for your own use.

