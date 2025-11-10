# OneView

> **Stop guessing what you can spend. Know your true financial picture.**

OneView is a personal finance SaaS application that provides users with a unified dashboard answering the three critical questions about their money:

1. **What you have** (Total Assets)
2. **What you owe** (Total Liabilities)
3. **What you can actually spend** (Available balance after upcoming bills)

## 🎯 Core Value Proposition

Eliminate financial guesswork by showing your **true spending power** after accounting for upcoming bills—not just your current balance. OneView gives you clarity on exactly what you owe, so you know what you can spend throughout the month.

## ✨ Features

### Current Features
- 🎨 **Modern Landing Page** with animated hero section and waitlist capture
- 💳 **Credit Card Management** - Track balances and due dates
- 💰 **Income Tracking** - Monitor recurring income streams (weekly, bi-weekly, monthly, yearly)
- 📊 **Expense Management** - Organize fixed expenses and subscriptions
- 📈 **Financial Health Dashboard** - Visualize your complete financial picture
- 🎨 **Theme Support** - Light/dark mode with persistent preferences
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile

### Planned Features
- 🏦 **Plaid Integration** - Automatic bank account linking and real-time syncing
- 🔄 **Recurring Transaction Detection** - Smart categorization of regular expenses
- 📊 **Transaction History** - Comprehensive view of all financial activity
- 🎯 **Budget Goals** - Set and track spending targets

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Frontend**: [React 19](https://react.dev/) + TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [DaisyUI 5](https://daisyui.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Payments**: [Stripe](https://stripe.com/)
- **Emails**: [Resend](https://resend.com/)
- **Banking** (Planned): [Plaid](https://plaid.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A Supabase account
- A Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd oneview-shipfast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # Resend (Email)
   RESEND_API_KEY=your_resend_api_key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   Run the SQL schema in your Supabase project:

   ```sql
   -- Users table (extends Supabase auth.users)
   CREATE TABLE users (
     id UUID PRIMARY KEY REFERENCES auth.users,
     email TEXT,
     name TEXT,
     customer_id TEXT,
     price_id TEXT,
     has_access BOOLEAN DEFAULT false,
     plan_category TEXT
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate sitemap (runs automatically after build)
npm run postbuild
```

## 📁 Project Structure

```
oneview-shipfast/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── stripe/             # Stripe checkout & portal
│   │   ├── auth/callback/      # Supabase OAuth callback
│   │   ├── webhook/stripe/     # Stripe webhook handler
│   │   └── lead/               # Lead capture
│   ├── demo-dashboard/         # Demo dashboard pages
│   │   ├── page.tsx           # Main dashboard
│   │   ├── credit-cards/      # Credit card management
│   │   ├── income/            # Income tracking
│   │   └── expenses/          # Expense tracking
│   ├── blog/                   # MDX blog content
│   ├── signin/                 # Authentication pages
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles & Tailwind config
├── components/                  # Reusable React components
│   ├── dashboard/             # Dashboard-specific components
│   ├── Hero.tsx               # Landing hero
│   ├── Pricing.tsx            # Pricing section
│   ├── ButtonSignin.tsx       # Auth button
│   └── ...
├── libs/                        # Utility libraries
│   ├── supabase/              # Supabase clients
│   ├── stripe.ts              # Stripe utilities
│   └── resend.ts              # Email utilities
├── types/                       # TypeScript definitions
└── config.ts                    # App configuration
```

## 💳 Pricing Tiers

OneView offers four pricing tiers to fit different needs:

### Manual Entry
- **Monthly**: $2/month - Manual balance updates
- **Lifetime**: $14 one-time - Lifetime access with manual updates

### Automatic Linking (with Plaid)
- **Pro Monthly**: $7/month - Automated syncing
- **Pro Lifetime**: $49 one-time - Full automation, lifetime access ⭐ Most Popular

All plans include:
- Financial health dashboard
- Recurring expense tracking
- Credit card management
- Income source tracking

## 🔐 Environment Variables

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (safe for client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client-side) |
| `RESEND_API_KEY` | Resend API key for emails |
| `NEXT_PUBLIC_APP_URL` | Your app's URL (e.g., https://one-view.app) |

### Optional Variables (Planned)

| Variable | Description |
|----------|-------------|
| `PLAID_CLIENT_ID` | Plaid client ID |
| `PLAID_SECRET` | Plaid secret key |
| `PLAID_ENV` | Plaid environment (sandbox/development/production) |

## 🎨 Customization

### Tailwind CSS v4

OneView uses Tailwind CSS v4 with CSS-first configuration. All customization is done in `app/globals.css` using the `@theme` directive:

```css
@import "tailwindcss";

@theme {
  --color-accent: #6e56cf;
  --color-primary: #3b82f6;
  --spacing-custom: 2.5rem;
}
```

### Branding

Update your branding in `config.ts`:

```typescript
const config = {
  appName: "OneView",
  appDescription: "Your financial clarity dashboard",
  domainName: "one-view.app",
  // ... more configuration
};
```

## 🔒 Security

OneView implements multiple security best practices:

- ✅ **Row Level Security (RLS)** in Supabase
- ✅ **Webhook signature verification** for Stripe
- ✅ **Server-side validation** with Zod
- ✅ **Environment variable protection** (service keys never exposed to client)
- ✅ **HTTPS-only cookies** for authentication
- ✅ **Input sanitization** before database operations

## 📚 Key Concepts

### Next.js 15 Async APIs

OneView uses Next.js 15, which requires awaiting certain APIs:

```typescript
// ✅ Correct
const cookieStore = await cookies();
const headersList = await headers();
const { id } = await params;

// ❌ Wrong
const cookieStore = cookies();
const { id } = params;
```

### Supabase Server Client

The server-side Supabase client is now async:

```typescript
// ✅ Correct
import { createClient } from "@/libs/supabase/server";
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

// ❌ Wrong
const supabase = createClient(); // Missing await
```

### Financial Calculations

The core financial health calculation:

```typescript
const totalAssets = accounts
  .filter(a => a.is_active && a.is_asset)
  .reduce((sum, a) => sum + a.balance, 0);

const totalLiabilities = accounts
  .filter(a => a.is_active && !a.is_asset)
  .reduce((sum, a) => sum + Math.abs(a.balance), 0);

const availableAfterLiabilities = totalAssets - totalLiabilities;
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[Your License Here]

## 🔗 Links

- [Live Demo](https://one-view.app/demo-dashboard)
- [Documentation](https://one-view.app/docs) _(Coming Soon)_

## 💬 Support

For support, please open an issue in the GitHub repository or contact [your-email@domain.com].

---

Built with ❤️ using [ShipFast](https://shipfa.st) as a foundation
