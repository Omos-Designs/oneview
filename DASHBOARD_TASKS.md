# OneView Dashboard Implementation Tasks

## 🎨 Design & Branding

### Color Fixes
- [ ] Replace all mint/neon blue colors with purple (#6e56cf)
  - [ ] "Net Worth" card font color (Accounts page)
  - [ ] "Annual Income" card font color (Income page)
  - [ ] "Top Category" card font color (Expenses page)
- [ ] Fix info tooltip styling to match brand colors
- [ ] Fix info tooltip z-index (currently hidden behind cards)

### Icons & Logos
- [ ] Remove ALL emojis across entire dashboard
- [ ] Integrate Logo.dev API for company logos
  - [ ] Add NEXT_PUBLIC_LOGO_DEV_KEY to environment variables
  - [ ] Create reusable CompanyLogo component
  - [ ] Use real bank account logos in Accounts section
  - [ ] Use company logos for subscriptions
  - [ ] Ensure all logos fit properly in circle frames
- [ ] Replace emoji icons with proper icon designs
  - [ ] Accounts table icons
  - [ ] Income table icons
  - [ ] Expenses table icons
  - [ ] Credit cards table icons

### Layout & Alignment
- [ ] Fix right-alignment of balances in Account Balances table on Dashboard
- [ ] Fix right-alignment in Income Sources table on Dashboard
- [ ] Center all icons in tables
- [ ] Move summary cards to TOP of all pages (before tables)
  - [ ] Accounts page
  - [ ] Income page
  - [ ] Expenses page

---

## 🏦 Accounts & Credit Cards

### Accounts Page Restructure
- [ ] Rename "Accounts" to "Bank Accounts"
- [ ] Remove "Cash" row from accounts table
- [ ] Limit account types to: Checking, Savings, Investing
- [ ] Fix sidebar visibility on Accounts page
- [ ] Move summary cards to top of page

### Credit Cards - New Separate Page
- [ ] Create new Credit Cards page (`/demo-dashboard/credit-cards`)
- [ ] Build credit cards table with CRUD functionality
- [ ] Add quick-add functionality directly in table
- [ ] Make credit card table more prominent on Dashboard
- [ ] Enable inline balance editing on Dashboard credit cards table
- [ ] Move credit card summary card to top of Credit Cards page

---

## 💰 Income Page Redesign

### Frequency-Based Display Logic
- [ ] Remove "Next Payment Date" field from forms
- [ ] Implement dynamic row display based on frequency:
  - [ ] Weekly: Display 4 rows (4 weeks/month)
  - [ ] Bi-weekly: Display 2 rows (2 paychecks/month)
  - [ ] Monthly: Display 1 row
  - [ ] Yearly: Display 1 row with annual/12 calculation
- [ ] Add checkmark toggle (right side) to mark income as received
- [ ] Update dashboard Income Sources display with same logic

### UI Improvements
- [ ] Rename "Annual Income" card to "Annual Gross Income"
- [ ] Ensure all 3 summary cards use different colors
- [ ] Move summary cards to top of page
- [ ] Fix tooltip z-index and styling

---

## 💳 Expenses & Subscriptions Redesign

### Page Restructure
- [ ] Rename page to "Fixed Expenses & Subscriptions"
- [ ] Split into TWO separate tables:
  - [ ] Fixed Monthly Expenses (Rent, Mortgage, Internet, Gas, etc.)
  - [ ] Monthly Subscriptions (wants you're not cancelling)
- [ ] Add explanatory text:
  - Fixed Expenses = things you NEED
  - Subscriptions = monthly recurring wants you're keeping

### Form & Data Changes
- [ ] Remove hard "due date" field
- [ ] Add "day of month" field (1-31) for recurring calculation
- [ ] Add checkmark toggle (right side) to mark as paid
- [ ] Update category system to:
  - Fixed Monthly Expense
  - Monthly Subscription
  - Monthly Loan Payment (→ goes to Fixed Expenses table)
  - Other
- [ ] Make Add button dynamic based on selected category

### Summary Cards
- [ ] Split summary cards for each table
- [ ] Move all summary cards to top
- [ ] Update "Top Category" card to use new category system
- [ ] Fix tooltip z-index and styling

### Dashboard Integration
- [ ] Update dashboard Upcoming Expenses to use new structure
- [ ] Enable quick-add for subscriptions on Dashboard table

---

## 📊 Dashboard Improvements

### Add Event Modal
- [x] Change "Add Transaction" button to "Add Event"
- [x] Create dynamic multi-step modal:
  - [x] Step 1: Choose event type (Income, Fixed Expense, Bank Account, Subscription, Credit Card)
  - [x] Step 2+: Show relevant fields based on selection
  - [x] Dynamic form rendering based on type
- [x] Wire up to appropriate tables/pages

### Manual Demo Banner
- [ ] Create prominent banner at top of ALL pages
- [ ] Text: "This demo shows manual entry. With Plaid integration, account balances and transactions would sync automatically."
- [ ] Make it dismissible but persistent across pages
- [ ] Style to match brand (purple accent)

### Month End Balance Card
- [x] Implement dynamic gradient based on value:
  - [x] Positive (far from 0) → Green gradient
  - [x] Near 0 → Yellow/Orange gradient
  - [x] Negative → Red gradient
- [x] Alternative: Dynamic font color gradient or status chip

### Other Dashboard Fixes
- [ ] Fix Cmd+K / Search functionality
- [ ] Add quick-add to Monthly Subscriptions table
- [ ] Enable inline editing for Credit Card balances
- [x] Fix "View All" button functionality on all tables
- [x] Remove one "View All" that just shows alert modal

---

## 🎭 Sidebar & Navigation

### Sidebar Improvements
- [ ] Fix sidebar visibility (only showing on Dashboard currently)
- [ ] Make sidebar collapsible using Pin icon
- [ ] Add functional Pin/Unpin toggle
- [ ] Update profile picture at bottom to match top-right
- [ ] Add dropdown menu to bottom profile (same as top-right)
- [ ] Disable Settings link in demo mode

### Profile Consistency
- [ ] Ensure profile picture consistent across:
  - [ ] TopBar (top-right)
  - [ ] Sidebar (bottom-left)
- [ ] Same dropdown menu for both locations

---

## 📈 Analytics Page

### Charting Library Integration
- [ ] Research and choose charting library (Chart.js, Recharts, or Tremor)
- [ ] Replace CSS-based visualizations with proper charts
- [ ] Create dynamic, interactive charts:
  - [ ] Income vs Expenses bar/line chart
  - [ ] Spending breakdown pie/donut chart
  - [ ] Net worth trend over time
  - [ ] Savings rate gauge
- [ ] Ensure charts use purple brand color
- [ ] Make charts responsive

---

## ✨ Animations & UX Polish

### Number Animations
- [ ] Implement ticker/scrolling animation for number changes
- [ ] Apply to all metric cards:
  - [ ] Dashboard metrics
  - [ ] Summary cards on all pages
  - [ ] Table totals
- [ ] Smooth transitions when values update

### Micro-interactions
- [ ] Add loading states for actions
- [ ] Success animations for checkmarks
- [ ] Hover states for quick-add functionality
- [ ] Smooth transitions for collapsible sidebar

---

## 🔧 Technical Improvements

### API Integration
- [ ] Add Logo.dev API integration
  - [ ] Environment variable setup
  - [ ] Fallback for missing logos
  - [ ] Caching strategy
- [ ] Implement proper search functionality (Cmd+K)

### Data Management
- [ ] Update frequency calculation logic for Income
- [ ] Implement recurring date calculations for Expenses
- [ ] Add checkmark state management across all tables
- [ ] Persist demo data to localStorage

---

## 📝 Content & Messaging

### Instructional Text
- [ ] Fixed Expenses description: "Essential monthly expenses you need to pay"
- [ ] Subscriptions description: "Recurring services you want but could cancel"
- [ ] Manual demo banner across all pages
- [ ] Tooltip improvements with better copy

---

## Priority Order

### Phase 1 - Critical Fixes (Do First)
1. Fix sidebar visibility across all pages
2. Remove all emojis and implement Logo.dev
3. Fix color issues (replace mint/blue with purple)
4. Fix alignment issues (right-align balances)
5. Fix tooltip z-index and styling
6. Move summary cards to top of pages

### Phase 2 - Structural Changes
1. Create Credit Cards page (separate from Accounts)
2. Rename Accounts to Bank Accounts
3. Restructure Expenses → Fixed Expenses & Subscriptions
4. Implement Income frequency logic (weekly/biweekly/monthly display)
5. Add checkmark toggles for income received and expenses paid

### Phase 3 - Dashboard Improvements
1. Create dynamic Add Event modal
2. Add manual demo banner
3. Implement Month End Balance gradient
4. Add quick-add functionality to tables
5. Enable inline editing for credit cards

### Phase 4 - Polish & Enhancements
1. Implement number animations
2. Collapsible sidebar
3. Fix Cmd+K search
4. Upgrade Analytics with charting library
5. Profile picture consistency

---

## Notes
- Logo.dev API Key needed in environment variables
- No Settings functionality in demo mode
- All pages need manual demo banner
- Maintain purple (#6e56cf) brand color throughout
