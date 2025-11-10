# OneView Dashboard - Implementation Tasks

## ✅ Completed (Phase 1 & 2)
- [x] Create Credit Cards page separate from Accounts
- [x] Rename Accounts to Bank Accounts
- [x] Restructure Expenses into Fixed Expenses & Subscriptions
- [x] Implement Income frequency logic (weekly/biweekly rows)
- [x] Fix neon blue colors to purple (#6e56cf) in globals.css
- [x] Add Logo.dev integration to Credit Cards
- [x] Remove credit limit tracking from Credit Cards

## 🚧 In Progress

### Dashboard (Main)
- [ ] Right-align balances in account and income tables
- [ ] Change button to "Add Event" with dynamic form (pick: income, fixed expense, bank account, subscription, credit card)
- [ ] Remove categories concept - only use Fixed Needs, Monthly Subscriptions, Credit Card balances
- [ ] Fix Cmd+K / Search functionality (not working)
- [ ] Fix info boxes z-index (hidden behind cards)
- [ ] Fix info box color theming to purple
- [ ] Enable quick add subscription directly in Monthly Subscriptions table
- [ ] Add demo banner explaining manual updating vs Plaid automation
- [ ] Dynamic gradient on Month End Balance card (red near 0, green when positive)
- [ ] Make credit card table more prominent
- [ ] Enable direct balance updates in credit card dashboard table

### Bank Accounts (/demo-dashboard/accounts)
- [ ] Remove ALL emojis, use proper icons/designs
- [ ] Implement Logo.dev API for real bank account logos
- [ ] Center icons properly
- [ ] Fix sidebar visibility (disappears when clicking into accounts)
- [ ] Remove "Cash" tab row
- [ ] Fix "Net Worth" card neon blue font color to purple
- [ ] Move summary cards to top
- [ ] Fix info box z-index
- [ ] Fix info box theming to purple

### Income (/demo-dashboard/income)
- [ ] Add checkmark toggle on right side to mark paycheck as "received"
- [ ] Fix "Annual Income" card color (neon blue to purple)
- [ ] Rename "Annual Income" to "Annual Gross Income"
- [ ] Move summary cards to top
- [ ] Fix info box z-index
- [ ] Fix info box theming to purple
- [ ] Use three different colors for summary cards (currently two are same after purple fix)
- [ ] Right-align balance column

### Expenses (/demo-dashboard/expenses)
- [ ] Add checkmark toggle on right side to mark as "paid"
- [ ] Fix "View all" buttons (not working)
- [ ] Move summary cards to top
- [ ] Fix "Top Category" card color to purple
- [ ] Condense categories to: Fixed Monthly Expense, Monthly Subscription, Monthly Loan Payment, Other
- [ ] Single "Add" button with dynamic form based on category selection
- [ ] Fix info box z-index
- [ ] Fix info box theming to purple

### Credit Cards (/demo-dashboard/credit-cards)
- [ ] Enable quick add credit card directly in table
- [ ] Enable quick edit directly in table (inline editing)
- [ ] Improve table prominence and design

### Overall / Global
- [ ] Fix sidebar visibility - only visible on dashboard tab
- [ ] Add ticker/scrolling animation for changing card values
- [ ] Implement collapsible sidebar with Pin icon
- [ ] Profile indicator in sidebar should use profile picture
- [ ] Sidebar profile should have same dropdown as top right
- [ ] Don't make settings clickable in demo mode
- [ ] Add demo banner on every page about manual vs Plaid automation
- [ ] Update analytics tab with popular charting libraries (Chart.js, Recharts, etc.)

## 📋 Task Categories Summary

### High Priority (User Experience Critical)
- Checkmark toggles for income/expenses
- Right-align all balance columns
- Demo banner on all pages
- Fix sidebar visibility issues
- Dynamic "Add Event" button

### Medium Priority (Visual Polish)
- Logo.dev integration for bank accounts
- Color consistency (purple everywhere)
- Info box z-index fixes
- Remove emojis, use proper icons
- Summary card positioning (move to top)

### Low Priority (Nice to Have)
- Ticker animations
- Collapsible sidebar
- Analytics charts
- Quick add/edit in tables
- Dynamic gradients

## 🎯 Implementation Order

1. **Checkmark Toggles** - Income & Expenses (HIGH IMPACT)
2. **Table Alignment** - Right-align all balance/amount columns
3. **Summary Cards** - Move to top in all pages
4. **Demo Banner** - Add to all dashboard pages
5. **Logo.dev for Banks** - Replace emojis with real logos
6. **Info Box Fixes** - Z-index and color theming
7. **Sidebar Fixes** - Visibility and collapsible functionality
8. **Add Event Button** - Dynamic form on dashboard
9. **Quick Add/Edit** - Inline table interactions
10. **Analytics Charts** - Implement charting library

---
**Last Updated:** 2025-11-07
**Status:** Phase 2 Complete, Phase 3 In Progress
