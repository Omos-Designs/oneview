# OneView - App Summary & Current State

## App Overview

**OneView** is a personal finance management application that provides users with a single, unified dashboard to see their complete financial picture at a glance. The core mission is to eliminate financial guesswork by answering three key questions:
1. **What you have** (Assets)
2. **What you owe** (Liabilities)
3. **What you can actually spend** (Available balance after obligations)

## Value Proposition

**Tagline:** "One single view for all your financials"

**Core Problem:** Most people struggle to know their true financial position because their money is scattered across multiple banks, credit cards, and investment accounts. They don't have a clear picture of what they can actually spend after accounting for upcoming bills.

**Solution:** OneView aggregates all financial accounts into one dashboard and calculates your true "available after liabilities" amount by factoring in:
- Current account balances
- Upcoming expected income (paychecks, freelance payments)
- Upcoming expected bills (rent, subscriptions, loan payments)

**Visual Health Indicator:** Users instantly see if they're "in the green" (positive balance) or "in the red" (deficit) based on their current and forecasted financial position.

---

## Core Features

### 1. **Account Aggregation**
- **Connect Multiple Financial Institutions:** Users securely link bank accounts, credit cards, investment accounts, and loans via Plaid
- **Real-time Balance Syncing:** Accounts automatically sync to show current balances
- **Account Types Supported:**
  - **Assets:** Checking accounts, savings accounts, investment accounts
  - **Liabilities:** Credit cards, loans, mortgages
- **Active/Inactive Toggle:** Users can exclude specific accounts from calculations (e.g., business accounts, joint accounts they want to track separately)

### 2. **Financial Health Dashboard**
The main dashboard displays:

**Top Section - Financial Summary Card:**
- **"Available After Liabilities" amount** - The most important number
- **Visual indicator:** Green badge with "You're in the Green!" or Red badge with "You're in the Red!"
- **Breakdown:**
  - Total Assets (account balances + pending income)
  - Total Liabilities (credit card balances + pending bills)

**Accounts Section:**
- Two-column layout: Assets on left, Liabilities on right
- Each account shows:
  - Institution name and account type
  - Account mask (last 4 digits)
  - Current balance
  - Available balance (if applicable)
- Checkbox to toggle account active/inactive status
- Excluded accounts shown separately with reduced opacity

**Upcoming This Month Widget:**
- Displays all recurring income and expenses for the current month
- Separated into "Expected Income" and "Expected Bills" sections
- Each item shows:
  - Name (e.g., "Paycheck", "Netflix")
  - Amount
  - Checkbox to mark as received/charged
  - Visual feedback when marked complete (strikethrough, badge)
- Auto-detection note: "Check when received. Auto-detected from transactions." (future feature)

### 3. **Recurring Events Manager**
A dedicated page for managing forecasted income and expenses.

**Layout:**
- Two-column layout (always visible, no tabs)
- Left column: Expected Income
- Right column: Expected Bills

**Features:**
- Quick add buttons for income and expenses (always displayed)
- Each recurring event includes:
  - **Name:** e.g., "Salary", "Rent", "Netflix"
  - **Amount:** Dollar amount
  - **Frequency:** Weekly, Bi-weekly, Monthly, Yearly
  - **Category:** Predefined categories (optional)
  - **Notes:** Additional details (optional)

**Income Categories:**
- Salary
- Freelance
- Business Income
- Investment Income
- Rental Income
- Side Hustle
- Dividend
- Interest
- Other Income

**Expense Categories (Condensed):**
- Rent/Mortgage
- Utilities (Phone, Internet, Gas, Electricity, Etc.)
- Subscriptions & Memberships
- Loan Payments
- Other
- (Custom categories via "Add Custom" in dropdown)

**Calculations:**
- Automatically converts all frequencies to monthly amounts for consistent tracking
- Shows total monthly income, total monthly expenses, and net monthly position
- Footer displays: "{X} income sources • {Y} bills • Surplus/Deficit"

**User Actions:**
- Add new recurring event
- Edit existing event (all fields editable)
- Delete recurring event
- Mark as active/inactive

**Data Sync:**
- Changes to recurring events immediately reflect on the dashboard
- Dashboard auto-refreshes when user navigates back (window focus event)

### 4. **Transaction Matching (Planned)**
When implemented, this will:
- Auto-detect recurring transactions from bank feeds
- Match transactions to user-defined recurring events
- Automatically check off items when they clear
- Suggest new recurring events based on transaction patterns

---

## User Flows

### Onboarding Flow
1. User lands on marketing page explaining the value proposition
2. User signs up/creates account
3. User is prompted to connect their first account via Plaid
4. Accounts sync and user sees their first dashboard
5. User adds recurring income/expenses to get accurate "available after liabilities" calculation

### Daily Use Flow
1. User opens OneView dashboard
2. Immediately sees if they're "in the green" or "in the red"
3. Sees "Available After Liabilities" amount - the true spendable balance
4. Reviews upcoming income and bills for the month
5. Checks off items as they're received/charged
6. Accounts auto-sync to show updated balances

### Managing Recurring Events Flow
1. User navigates to Recurring Events page
2. Sees both income and bills side-by-side
3. Clicks "Add Income" or "Add Expense"
4. Fills in quick form: Name, Amount, Frequency, Category (optional)
5. Saves and sees it immediately on the dashboard
6. Can edit or delete at any time

### Account Management Flow
1. User navigates to Accounts page
2. Sees all connected accounts grouped by type
3. Can link new accounts via Plaid
4. Can toggle accounts active/inactive to exclude from calculations
5. Can manually sync accounts

---

## Data Models

### User
- Email (unique identifier)
- Name
- Password (hashed)
- Created timestamp

### Account
- User ID (foreign key)
- Plaid item ID
- Plaid account ID
- Name
- Official name
- Type (depository, credit, investment, loan)
- Subtype (checking, savings, credit card, etc.)
- Mask (last 4 digits)
- Current balance
- Available balance
- Currency code
- Is active (boolean - for excluding from calculations)

### Recurring Event
- User ID (foreign key)
- Name (e.g., "Netflix", "Paycheck")
- Type (income or expense)
- Amount
- Category (optional)
- Frequency (weekly, biweekly, monthly, yearly)
- Start date
- Next due date
- Is active (boolean)
- Last charged at (timestamp - for marking as received/paid)
- Notes (optional)

### Plaid Item (Connection)
- User ID (foreign key)
- Access token
- Institution ID
- Institution name
- Status

---

## Current State of Implementation

### ✅ Fully Implemented Features

1. **Authentication System**
   - User registration and login
   - Session management
   - Protected routes

2. **Account Connection via Plaid**
   - Link Token generation
   - Account linking flow
   - Multiple institution support
   - Account syncing

3. **Main Dashboard**
   - Financial health indicator (green/red)
   - Available after liabilities calculation
   - Assets vs Liabilities breakdown
   - Account listing with active/inactive toggles
   - Upcoming income/bills widget with checkboxes
   - Compact, optimized layout

4. **Recurring Events Manager**
   - Two-column layout (income/expenses always visible)
   - Separate quick add forms for income and expenses
   - Full CRUD operations (Create, Read, Update, Delete)
   - Form state isolation (no focus loss issues)
   - Real-time sync with dashboard
   - Monthly total calculations
   - Frequency conversion (weekly/biweekly/yearly to monthly)
   - Condensed expense categories

5. **Accounts Page**
   - View all connected accounts
   - Link new institutions
   - Manual sync functionality

6. **Landing Page**
   - Hero section with animated background
   - Feature cards showcasing key features
   - Pricing section
   - Testimonials
   - FAQ section
   - CTA sections

### 🚧 Partially Implemented / In Progress

1. **Recurring Event Status Tracking**
   - Users can manually check off items as received/charged
   - Stores timestamp in `last_charged_at` field
   - Visual feedback on dashboard (strikethrough, badges)
   - **Missing:** Automatic reset for next period

### 📋 Planned Features (Not Yet Implemented)

1. **Transaction Matching for Recurring Items**
   - Auto-detect recurring transactions from bank feeds
   - Match to user-defined recurring events
   - Auto-check when transaction clears
   - Suggest new recurring events from patterns

2. **Recurring Detection During Account Connection**
   - Analyze initial transaction history
   - Suggest recurring events to add
   - One-click add from suggestions

3. **6-Month Net Position Trends Chart**
   - Historical view of "available after liabilities" over time
   - Line/area chart visualization
   - Forecast based on recurring events

4. **Transaction Sync from Plaid**
   - Fetch and store transaction history
   - Display transaction list
   - Search and filter transactions

5. **Spending Overview with Graphs**
   - Spending by category
   - Income vs expenses charts
   - Budget tracking

6. **CSV Export**
   - Export account data
   - Export transaction history
   - Export recurring events

7. **Monthly Reset for Recurring Events**
   - Automatically uncheck items at the start of each billing period
   - Based on next_due_date field

8. **Notifications/Reminders**
   - Email reminders for upcoming bills
   - Alerts when going into the red

9. **Multi-Currency Support**
   - Currently defaults to USD
   - Need currency conversion for international accounts

---

## UI/UX Design Principles

1. **Instant Clarity:** The most important number (available after liabilities) is front and center
2. **Visual Feedback:** Green/red color coding for financial health
3. **Minimal Clicks:** Quick add forms, checkboxes for status updates
4. **Always-On Information:** No tabs or hidden sections for critical data
5. **Compact Design:** Optimized spacing to fit more on screen
6. **Responsive:** Works on desktop, tablet, and mobile
7. **Glass Morphism:** Modern aesthetic with frosted glass effects
8. **Smooth Animations:** Subtle transitions and hover effects

---

## User Types & Use Cases

### Primary User: Budget-Conscious Individual
- Has multiple bank accounts and credit cards
- Wants to know true spending power before making purchases
- Needs to track recurring subscriptions and bills
- Values simplicity over complex financial analysis

### Use Case Examples:
1. **"Can I afford this?"** - User checks dashboard before making a large purchase to see if they'll still be "in the green" after upcoming bills
2. **"What's draining my account?"** - User reviews recurring expenses to find subscriptions to cancel
3. **"When do I get paid again?"** - User sees upcoming income events and amounts
4. **"Did Netflix charge me yet?"** - User checks off bills as they clear

---

## Business Model Considerations

Based on the landing page, the app appears to have a freemium model:
- Free tier for basic features
- Paid tier for advanced features (likely transaction history, analytics, exports)
- Stripe integration already in place for payments

---

## Technical Integration Points

### Plaid Integration
- **Link Account Flow:** Create link token → Open Plaid Link modal → Exchange public token for access token
- **Supported Account Types:** Checking, Savings, Credit Cards, Loans, Investments
- **Balance Updates:** Fetch current and available balances

### Supabase Integration
- User authentication
- Database storage for users, accounts, recurring events, Plaid items
- Row-level security policies

### NextAuth
- Session management
- Email/password authentication
- Protected API routes

---

## Key Differentiators from Competitors

1. **Focus on "Available After Liabilities"** - Most apps show total balance; OneView shows what you can actually spend
2. **Visual Health Indicator** - Instant green/red feedback
3. **Recurring Events Forecasting** - Accounts for future income and bills, not just current state
4. **Simplified Interface** - One dashboard, minimal complexity
5. **Manual + Automatic Tracking** - Users can manually add recurring events while waiting for automatic detection

---

## Next Steps for Rebuild

When rebuilding with the NextJS template, focus on:

1. **Database Schema Setup:**
   - Users table
   - Accounts table (with is_active field)
   - Recurring_events table (with all fields including last_charged_at)
   - Plaid_items table

2. **Core Feature Priority:**
   - Account connection via Plaid (highest priority)
   - Recurring events CRUD
   - Dashboard calculations
   - Active/inactive account toggles

3. **Data Sync Logic:**
   - Window focus event for dashboard refresh
   - Cache-busting with `cache: 'no-store'`
   - Refetch after mutations

4. **UI Components to Preserve:**
   - Financial health indicator design
   - Two-column recurring events layout
   - Compact dashboard layout
   - Checkbox interactions for marking items complete
   - Glass morphism styling

5. **Forms Architecture:**
   - Separate state for income and expense forms to prevent re-renders
   - All hooks before conditional returns (avoid React hooks violations)

---

## Known Issues to Avoid in Rebuild

1. **React Hooks Order Violation:** Ensure all hooks (useEffect, useState) are called before any conditional returns
2. **Focus Loss in Forms:** Use separate stable state objects for each form; avoid recreating components on every render
3. **Stale Dashboard Data:** Implement window focus listener and cache-busting for data freshness
4. **Form State Management:** Don't share state between income and expense forms

---

## Summary

OneView is a focused, user-friendly personal finance dashboard that solves one problem exceptionally well: **showing users their true available spending power**. Unlike comprehensive financial tools that overwhelm with features, OneView prioritizes simplicity and instant clarity. The core loop is: connect accounts → add recurring events → see if you're in the green or red → make informed spending decisions. The app is production-ready for MVP with all core features implemented, and has a clear roadmap for enhanced features like transaction matching and trend analysis.
