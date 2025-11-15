# Dashboard Testing Checklist

This checklist ensures all /dashboard functionality matches /demo-dashboard behavior. Test each item systematically and mark any failures.

## 🔑 Core Dashboard Functionality (/dashboard)

### Adding Events from Dashboard Modal

- [ ] **Add Income Source**
  1. Click "Add Event" button on dashboard
  2. Select "Income" event type
  3. Fill in source, amount, frequency, category
  4. Click "Add"
  5. ✅ Modal should close
  6. ✅ Income should appear in "Upcoming Income" section
  7. ✅ Check /dashboard/income - income should be listed there
  8. ✅ Calculations should update (Forecasted Cash should increase)

- [ ] **Add Income Error Handling**
  1. Try adding income with invalid data or trigger a database error
  2. ✅ Alert should display error message
  3. ✅ Modal should stay open (not close)
  4. ✅ Form should retain entered data

- [ ] **Add Expense**
  1. Click "Add Event" → Select "Expense"
  2. Fill in name, amount, due date, category
  3. Click "Add"
  4. ✅ Should appear in "Upcoming Expenses" section
  5. ✅ Check /dashboard/expenses - expense should be listed
  6. ✅ Total Expenses should increase

- [ ] **Add Subscription**
  1. Click "Add Event" → Select "Subscription"
  2. Fill in name, amount, frequency
  3. Click "Add"
  4. ✅ Should appear in "Subscriptions" section
  5. ✅ Total Expenses should include subscription amount

- [ ] **Add Bank Account (from modal)**
  1. Click "Add Event" → Select "Bank Account"
  2. Fill in name, type, balance
  3. Click "Add"
  4. ✅ Should appear in "Your Accounts" section
  5. ✅ Current Cash should update

- [ ] **Add Credit Card**
  1. Click "Add Event" → Select "Credit Card"
  2. Fill in name, balance, limit, due date
  3. Click "Add"
  4. ✅ Should appear in "Credit Cards" section
  5. ✅ Total Expenses should increase by card balance

### Account Management

- [ ] **Toggle Account Active/Inactive**
  1. Uncheck an active account checkbox
  2. ✅ Account should gray out
  3. ✅ Current Cash should decrease (excluding this account)
  4. ✅ Month End Balance should recalculate
  5. Check it again
  6. ✅ Should become active and included in calculations

- [ ] **Update Account Balance**
  1. Click on balance input for an account
  2. Change the value (e.g., from $3420.50 to $5000.00)
  3. ✅ Current Cash should update immediately
  4. ✅ Month End Balance should recalculate
  5. Refresh page
  6. ✅ New balance should persist (saved to database)

- [ ] **Update Credit Card Balance**
  1. Find a credit card in the dashboard
  2. Update its balance input
  3. ✅ Total Expenses should update immediately
  4. ✅ Month End Balance should recalculate

### Checkbox Functionality

- [ ] **Income Received/Not Received**
  1. Click the circle button next to an income source
  2. ✅ Should turn green/accent color when checked
  3. ✅ Income item should fade (opacity-60)
  4. ✅ Forecasted Cash should DECREASE (income no longer counted as "upcoming")
  5. ✅ Month End Balance should recalculate
  6. Click again to uncheck
  7. ✅ Should return to normal state
  8. ✅ Forecasted Cash should increase again

- [ ] **Expense Paid/Not Paid**
  1. Click the circle button next to an expense
  2. ✅ Should turn green when checked
  3. ✅ Expense item should fade
  4. ✅ Total Expenses should DECREASE
  5. ✅ Month End Balance should increase
  6. Click again to uncheck
  7. ✅ Should return to normal

- [ ] **Subscription Paid/Not Paid**
  1. Same behavior as expense checkbox
  2. ✅ Verify calculations update correctly

### Calculations Verification

- [ ] **Current Cash**
  - ✅ Should equal sum of all ACTIVE accounts (excluding "Cash" accounts)
  - ✅ Should update when toggling accounts or changing balances

- [ ] **Forecasted Cash**
  - ✅ Should equal Current Cash + Upcoming Income (unchecked income only)
  - ✅ Should update when income is checked/unchecked

- [ ] **Total Expenses**
  - ✅ Should include: unpaid expenses + unpaid subscriptions + active credit card balances
  - ✅ Should update when expenses/subscriptions are checked

- [ ] **Month End Balance**
  - ✅ Should equal Forecasted Cash - Total Expenses
  - ✅ Gradient background color:
    - Red: balance < 0
    - Yellow: balance >= 0 and < 500
    - Green: balance >= 500
  - ✅ Text color should match gradient
  - ✅ Message should say:
    - "You're in the red" if < 0
    - "Getting close to zero" if >= 0 and < 500
    - "You're in the green!" if >= 500

## 📊 Subpage Testing

### /dashboard/accounts

- [ ] **Navigation**
  - ✅ Click "View All →" from accounts section on dashboard
  - ✅ Should navigate to /dashboard/accounts

- [ ] **Add Bank Account Button**
  1. Click "Add Bank Account" button (both empty state and main button)
  2. ✅ Should redirect to /dashboard/events/add?type=bank-account
  3. ✅ Should NOT redirect back to plain /dashboard

- [ ] **Account List Display**
  - ✅ All accounts should be listed
  - ✅ Should show balance, type, provider
  - ✅ Should show logos if available

- [ ] **Edit Account**
  1. Click edit button on an account
  2. ✅ Modal/form should open with current values pre-filled
  3. Change values and save
  4. ✅ Changes should persist

- [ ] **Delete Account**
  1. Click delete button
  2. ✅ Confirmation should appear
  3. Confirm deletion
  4. ✅ Account should be removed from list and database

- [ ] **Toggle Account (if present on accounts page)**
  - ✅ Same behavior as dashboard toggle

### /dashboard/income

- [ ] **Navigation**
  - ✅ Access via sidebar or breadcrumb

- [ ] **Income List**
  - ✅ All income sources should be listed
  - ✅ Should show source, amount, frequency, category
  - ✅ Next payment date should be displayed

- [ ] **Add Income**
  1. Click "Add Income" button
  2. ✅ Should open modal (NOT redirect)
  3. Fill form and submit
  4. ✅ Should add to list

- [ ] **Edit Income**
  1. Click edit button
  2. ✅ Form should open with current values
  3. Modify and save
  4. ✅ Changes should persist

- [ ] **Delete Income**
  1. Click delete button
  2. ✅ Confirmation should appear
  3. Confirm
  4. ✅ Income should be removed

### /dashboard/expenses

- [ ] **Navigation**
  - ✅ Access via sidebar

- [ ] **Expenses Separation**
  - ✅ Fixed expenses and subscriptions should be in separate sections
  - ✅ Subscriptions = category "Subscriptions & Memberships"

- [ ] **Add Expense**
  1. Click "Add Expense" button
  2. ✅ Should open modal
  3. Fill and submit
  4. ✅ Should add to appropriate section

- [ ] **Add Subscription**
  1. Switch to subscription tab in add modal
  2. Fill and submit
  3. ✅ Should appear in subscriptions section

- [ ] **Edit Expense**
  - ✅ Form should open with current values
  - ✅ Changes should persist

- [ ] **Delete Expense**
  - ✅ Should remove from list and database

- [ ] **Due Date Display**
  - ✅ Should show ordinal suffix (1st, 2nd, 3rd, 15th, etc.)

### /dashboard/credit-cards

- [ ] **Navigation**
  - ✅ Access via sidebar or dashboard section

- [ ] **Card List**
  - ✅ All cards should be listed with balance, limit, due date
  - ✅ Should show utilization percentage

- [ ] **Add Credit Card**
  1. Click "Add Credit Card"
  2. ✅ Should open modal
  3. Fill in details
  4. ✅ Should add to list

- [ ] **Edit Card**
  - ✅ Should open form with current values
  - ✅ Changes should persist

- [ ] **Delete Card**
  - ✅ Should remove from list

- [ ] **Summary Statistics**
  - ✅ Total balance should only include ACTIVE cards
  - ✅ Active card count should be accurate

### /dashboard/analytics

- [ ] **Page Loads**
  - ✅ Should load without errors
  - ✅ Should display charts/graphs if data exists
  - ✅ Should show empty state if no data

### /dashboard/settings

- [ ] **Page Loads**
  - ✅ Should display settings options
  - ✅ Should load user profile data
  - ✅ Forms should function correctly

## 🧭 Navigation Testing

### Sidebar

- [ ] **All Links Work**
  - ✅ Dashboard link → /dashboard
  - ✅ Accounts link → /dashboard/accounts
  - ✅ Income link → /dashboard/income
  - ✅ Expenses link → /dashboard/expenses
  - ✅ Credit Cards link → /dashboard/credit-cards
  - ✅ Analytics link → /dashboard/analytics
  - ✅ Settings link → /dashboard/settings

- [ ] **Active State**
  - ✅ Current page should be highlighted/indicated

- [ ] **Pin/Unpin**
  - ✅ Pin button should expand/collapse sidebar
  - ✅ State should persist across page navigations

### TopBar

- [ ] **User Menu**
  - ✅ Should display user name/email
  - ✅ Dropdown should work
  - ✅ Sign out should work

- [ ] **Theme Toggle**
  - ✅ Should switch between light/dark/system themes
  - ✅ Theme should persist

### Breadcrumbs

- [ ] **Display Correctly**
  - ✅ Should show current location path
  - ✅ Links should navigate correctly

## 📱 Mobile Responsiveness

### Dashboard Page

- [ ] **Mobile View (< 640px)**
  - ✅ Sidebar should collapse to icons only
  - ✅ Cards should stack vertically
  - ✅ Text should remain readable
  - ✅ Buttons should be tappable
  - ✅ Modals should be full-width or appropriately sized

### All Subpages

- [ ] **Test Each Page on Mobile**
  - ✅ /dashboard/accounts
  - ✅ /dashboard/income
  - ✅ /dashboard/expenses
  - ✅ /dashboard/credit-cards
  - ✅ /dashboard/analytics
  - ✅ /dashboard/settings

- [ ] **Forms on Mobile**
  - ✅ Input fields should be accessible
  - ✅ Keyboard should not obscure inputs
  - ✅ Submit buttons should be reachable

## 🎨 UI/UX Details

### Info Tooltips

- [ ] **All Info Icons Work**
  - ✅ Current Cash info icon
  - ✅ Forecasted Cash info icon
  - ✅ Total Expenses info icon
  - ✅ Month End Balance info icon
  - ✅ Any other info icons throughout the app

- [ ] **Mobile Behavior**
  - ✅ Tooltips should not overflow off screen
  - ✅ Should be readable on small screens

### Empty States

- [ ] **Display Correctly When No Data**
  - ✅ No accounts → shows empty state with "Add Account" CTA
  - ✅ No income → shows empty state
  - ✅ No expenses → shows empty state
  - ✅ No subscriptions → shows empty state
  - ✅ No credit cards → shows empty state

### Modals

- [ ] **Modal Behavior**
  - ✅ Close button (X) works
  - ✅ Click outside modal closes it
  - ✅ ESC key closes modal
  - ✅ Form resets when modal closes
  - ✅ Modal stays open on error (with error message)
  - ✅ Modal closes on successful submission

### Form Validation

- [ ] **Required Fields**
  - ✅ All required fields should be marked with * or "required"
  - ✅ Submitting empty required field should show error
  - ✅ Error messages should be clear

- [ ] **Number Inputs**
  - ✅ Should only accept numbers
  - ✅ Should handle decimals correctly (e.g., 1234.56)

- [ ] **Date Inputs**
  - ✅ Should accept appropriate date formats
  - ✅ Should validate dates

## 🔄 Data Persistence

- [ ] **Refresh Tests**
  1. Add an income source
  2. Refresh the page
  3. ✅ Income should still be there
  4. Repeat for:
     - ✅ Expenses
     - ✅ Subscriptions
     - ✅ Bank accounts
     - ✅ Credit cards

- [ ] **Balance Updates Persist**
  1. Change account balance
  2. Refresh page
  3. ✅ New balance should be retained

- [ ] **Toggle States Persist**
  1. Toggle account inactive
  2. Refresh page
  3. ✅ Account should still be inactive

## 🐛 Edge Cases

- [ ] **Zero Balances**
  - ✅ Accounts with $0.00 balance should display correctly
  - ✅ Calculations should handle zero values

- [ ] **Negative Balances**
  - ✅ Credit cards can have positive balances (money owed)
  - ✅ Should display correctly in calculations

- [ ] **Large Numbers**
  - ✅ Test with balances like $1,234,567.89
  - ✅ Should format with commas and 2 decimal places

- [ ] **Multiple Users**
  - ✅ One user's data should not show for another user
  - ✅ Test with different accounts

- [ ] **Concurrent Updates**
  - ✅ Open dashboard in two tabs
  - ✅ Update in one tab
  - ✅ Refresh other tab → changes should be reflected

## ⚡ Performance

- [ ] **Page Load Speed**
  - ✅ Dashboard should load within 2 seconds
  - ✅ No visible lag when toggling/updating

- [ ] **No Console Errors**
  - ✅ Open browser dev tools
  - ✅ Should see no red errors in console
  - ✅ Warnings are acceptable but investigate any errors

---

## Testing Completion Summary

**Total Tests:** ~150+ individual checks
**Completed:** ___
**Failed:** ___
**Blocked:** ___

### Critical Failures (if any)

Document any critical issues that block functionality:

1.
2.
3.

### Non-Critical Issues (if any)

Document minor UI/UX issues:

1.
2.
3.

---

**Testing Date:** ___________
**Tested By:** ___________
**Environment:** Local Development / Staging / Production
**Browser(s) Tested:** ___________
**Device(s) Tested:** ___________
