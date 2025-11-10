# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: OneView

**OneView** is a personal finance SaaS application that provides users with a unified financial dashboard answering three critical questions:
1. **What you have** (Total Assets)
2. **What you owe** (Total Liabilities)
3. **What you can actually spend** (Available balance after upcoming bills)

**Core Value Proposition:** Eliminate financial guesswork by showing true spending power after accounting for upcoming bills, not just current balance.

**Tech Stack:** Next.js 15 + React 19 + TypeScript + Supabase + Stripe + Plaid (planned) + Tailwind CSS 4 + DaisyUI 5

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Note: `npm run build` automatically runs `next-sitemap` post-build to generate sitemap.

## Architecture Overview

### Application Structure
```
app/
├── api/                    # API routes (Stripe, auth, webhooks)
│   ├── stripe/            # Stripe checkout & portal
│   ├── auth/callback/     # Supabase OAuth callback
│   ├── webhook/stripe/    # Stripe webhook handler
│   └── lead/              # Lead capture
├── dashboard/             # Protected user dashboard (planned)
├── blog/                  # MDX blog content
├── signin/                # Authentication pages
└── page.tsx              # Landing page (Hero, Problem, Features, Pricing, FAQ, CTA)

components/                # Reusable React components
├── Hero.tsx              # Landing hero with animated underlines
├── Problem.tsx           # Problem agitation section
├── FeaturesAccordion.tsx # Features accordion
├── Pricing.tsx           # 4-tier pricing (Manual/Pro × Monthly/Lifetime)
├── ButtonCheckout.tsx    # Stripe checkout integration
└── ...

libs/                      # Utility libraries
├── supabase/
│   ├── server.ts         # Server-side Supabase client (async)
│   ├── client.ts         # Client-side Supabase client
│   └── middleware.ts     # Session refresh middleware
├── stripe.ts             # Stripe utilities
├── resend.ts             # Email utilities
└── api.ts                # API client

types/                     # TypeScript definitions
config.ts                  # App configuration (pricing, branding, features)
```

### Key Configuration (`config.ts`)

**Pricing Tiers:**
1. **Manual Monthly** ($2/month) - Manual balance updates, no Plaid
2. **Manual Lifetime** ($14 one-time) - Same as monthly, lifetime access
3. **Pro Monthly** ($7/month) - Plaid integration, automatic syncing
4. **Pro Lifetime** ($49 one-time, featured) - Full automation, lifetime

**Important:** Pricing has two categories: `"manual"` and `"plaid"` for toggling Plaid-related features.

### Next.js 15 Critical Patterns

#### Async APIs (REQUIRED)
```typescript
// ✅ Correct - Always await Next.js 15 async APIs
const cookieStore = await cookies();
const headersList = await headers();
const { id } = await params; // Dynamic route params are now Promises

// ❌ Wrong - Will throw errors in Next.js 15
const cookieStore = cookies();
const { id } = params;
```

#### Supabase Server Client (REQUIRED)
```typescript
// ✅ Correct - createClient() is async in Next.js 15
import { createClient } from "@/libs/supabase/server";
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

// ❌ Wrong - Missing await
const supabase = createClient();
```

#### Authentication Check Pattern
```typescript
// Server component authentication
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  redirect("/signin"); // From next/navigation
}
```

### Tailwind CSS v4 (CSS-First Configuration)

**No `tailwind.config.js`** - All customization in `app/globals.css` using `@theme` directive:

```css
@import "tailwindcss";

@theme {
  --color-brand-500: #570df8;
  --spacing-custom: 2.5rem;
}
```

### Stripe Integration

**Webhook Handler:** `app/api/webhook/stripe/route.ts`
- Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
- Handle events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- Update Supabase users table with customer/subscription data

**Checkout Flow:**
1. User clicks pricing tier → `ButtonCheckout` component
2. POST to `/api/stripe/create-checkout` with `priceId`
3. Redirect to Stripe Checkout
4. Webhook updates user access in Supabase
5. Redirect to `/dashboard` (configured in `config.auth.callbackUrl`)

### Supabase Database Schema (Expected)

```sql
-- Users table (extends Supabase auth.users)
users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  name TEXT,
  customer_id TEXT, -- Stripe customer ID
  price_id TEXT,    -- Current Stripe price ID
  has_access BOOLEAN DEFAULT false,
  plan_category TEXT -- 'manual' or 'plaid'
)
```

### Plaid Integration (Planned)

**Key Features to Implement:**
- Account linking via Plaid Link
- Real-time balance syncing
- Transaction history fetching
- Recurring transaction detection
- Only available for `plan_category = 'plaid'` users

**API Structure (To Be Built):**
```
app/api/plaid/
├── create-link-token/   # Generate Plaid Link token
├── exchange-token/      # Exchange public token for access token
├── sync-accounts/       # Fetch account balances
└── sync-transactions/   # Fetch transaction history
```

## Code Conventions

### Import Order
1. React and Next.js
2. Third-party libraries
3. Internal components (`@/components`)
4. Internal utilities (`@/libs`)
5. Internal types (`@/types`)
6. Config (`@/config`)
7. Relative imports

### File Naming
- **Components:** PascalCase files, PascalCase exports (`ButtonCheckout.tsx`)
- **Pages:** `page.tsx` in route folders
- **API Routes:** `route.ts` in route folders
- **Utilities:** camelCase files (`stripe.ts`)
- **Types:** camelCase files in `types/` folder

### TypeScript
- Use strict TypeScript with proper typing
- Prefer `interface` over `type` for object definitions
- Import types using `import type { }` when possible
- Use Zod for runtime validation (already installed)
- Always handle Promise types correctly (Next.js 15 async APIs)

### Component Patterns
- Default to server components; add `"use client"` only when necessary
- Client directives required for: hooks, event handlers, browser APIs, context
- Use proper TypeScript interfaces for props
- Export default for main component, named exports for utilities

### Security (Snyk Integration)

**CRITICAL:** Always run Snyk security scans on new code:
1. Generate/modify first-party code
2. Run `snyk_code_scan` tool (if available via MCP)
3. Fix any security issues found
4. Rescan until no issues remain

**Common Security Patterns:**
- Validate all API inputs with Zod
- Use Supabase RLS (Row Level Security) policies
- Verify Stripe webhook signatures
- Never expose `SUPABASE_SERVICE_ROLE_KEY` on client
- Sanitize user inputs before database operations

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Server-only, never expose

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Plaid (to be added)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox  # or development/production

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production
```

## OneView-Specific Implementation Notes

### Financial Calculations

**Available After Liabilities Formula:**
```typescript
const totalAssets = accounts
  .filter(a => a.is_active && a.is_asset)
  .reduce((sum, a) => sum + a.balance, 0);

const totalLiabilities = accounts
  .filter(a => a.is_active && !a.is_asset)
  .reduce((sum, a) => sum + Math.abs(a.balance), 0);

const availableAfterLiabilities = totalAssets - totalLiabilities;
```

**Health Indicator Logic:**
```typescript
const isHealthy = availableAfterLiabilities >= 0;
// Green badge: "You're in the Green!"
// Red badge: "You're in the Red!"
```

### Recurring Events (Planned Feature)

**Categories:**
- **Income:** Salary, Freelance, Business Income, Investment Income, Rental Income, Side Hustle, Dividend, Interest, Other
- **Expenses:** Rent/Mortgage, Utilities (Phone, Internet, Gas, Electricity), Subscriptions & Memberships, Loan Payments, Other, Custom

**Frequency Conversion to Monthly:**
```typescript
const frequencyMultipliers = {
  weekly: 52 / 12,      // ~4.33
  biweekly: 26 / 12,    // ~2.17
  monthly: 1,
  yearly: 1 / 12,       // ~0.083
};
```

### Landing Page Structure

**Current State:** Landing page is fully implemented with:
- Hero (animated underlines, CTA buttons)
- Problem (3-point agitation)
- Features Accordion
- Pricing (4 tiers in 2-column manual/plaid layout)
- FAQ
- CTA (final conversion section)
- Footer

**Dashboard State:** Dashboard routes exist but are not yet implemented. Focus on building:
1. Main dashboard with financial health indicators
2. Accounts management page (connect Plaid, view balances, toggle active/inactive)
3. Recurring events manager (income & expenses)
4. Transaction history (future)

## Common Gotchas

### Next.js 15 Migration Issues
- **Problem:** `params` not awaited in dynamic routes
  - **Solution:** `const { id } = await params;`
- **Problem:** `cookies()` or `headers()` called without await
  - **Solution:** `const cookieStore = await cookies();`
- **Problem:** Supabase server client not awaited
  - **Solution:** `const supabase = await createClient();`

### Tailwind CSS v4 Issues
- **Problem:** `tailwind.config.js` changes not applying
  - **Solution:** Move all config to `@theme` in `app/globals.css`
- **Problem:** Custom colors not working
  - **Solution:** Use CSS variables: `--color-brand-500: #570df8;`

### Stripe Webhook Issues
- **Problem:** Webhook signature verification failing
  - **Solution:** Use raw body, not parsed JSON. Use `await request.text()` in route handler.
- **Problem:** User access not updating after payment
  - **Solution:** Ensure webhook handler updates Supabase `users` table correctly

## MCP Integrations

**Active MCP Servers:**
1. **Plaid MCP** (SSE) - For testing bank account connections during development
2. **Stripe MCP** (HTTP) - For creating test customers and subscriptions
3. **Figma MCP** (HTTP) - For design system consistency and asset extraction
4. **Chrome DevTools MCP** (stdio) - For automated E2E testing and visual regression

**Use Cases:**
- Test Plaid OAuth flow without manual UI clicking
- Create Stripe test subscriptions for all 4 pricing tiers
- Validate dashboard UI against Figma designs
- Automate user journey testing (signup → payment → dashboard)

## Commit Message Format

Use Conventional Commits:
- `feat:` - New features (e.g., `feat: add Plaid account linking`)
- `fix:` - Bug fixes (e.g., `fix: correct available balance calculation`)
- `refactor:` - Code refactoring (e.g., `refactor: extract pricing logic to utility`)
- `style:` - UI/styling changes (e.g., `style: update dashboard card spacing`)
- `docs:` - Documentation (e.g., `docs: add API route documentation`)
- `test:` - Tests (e.g., `test: add unit tests for balance calculations`)
- `chore:` - Maintenance (e.g., `chore: update dependencies`)

---

**Last Updated:** Initial creation with landing page complete, dashboard implementation pending.