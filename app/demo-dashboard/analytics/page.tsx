"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";

// Sample data - in a real app, this would come from your state management or API
const SAMPLE_DATA = {
  accounts: [
    { name: "Chase Checking", balance: 5420.50, type: "asset" },
    { name: "Ally Savings", balance: 15230.00, type: "asset" },
    { name: "Capital One Credit Card", balance: 1250.00, type: "liability" },
    { name: "Cash", balance: 320.00, type: "asset" },
  ],
  income: [
    { source: "Salary - Tech Corp", amount: 3200, frequency: "biweekly" as const },
    { source: "Freelance", amount: 1500, frequency: "monthly" as const },
    { source: "Dividend Income", amount: 250, frequency: "monthly" as const },
  ],
  expenses: [
    { name: "Rent", amount: 1800, category: "Housing", frequency: "monthly" as const },
    { name: "Electric Bill", amount: 120, category: "Utilities", frequency: "monthly" as const },
    { name: "Internet", amount: 80, category: "Utilities", frequency: "monthly" as const },
    { name: "Phone Bill", amount: 65, category: "Utilities", frequency: "monthly" as const },
    { name: "Car Insurance", amount: 450, category: "Insurance", frequency: "monthly" as const },
    { name: "Netflix", amount: 15.99, category: "Entertainment", frequency: "monthly" as const },
  ],
};

function AnalyticsPageContent() {
  const { isPinned } = useSidebar();
  const [data] = useState(SAMPLE_DATA);

  // Frequency multipliers
  const frequencyMultipliers = {
    weekly: 52 / 12,
    biweekly: 26 / 12,
    monthly: 1,
    yearly: 1 / 12,
  };

  const getMonthlyAmount = (amount: number, frequency: "weekly" | "biweekly" | "monthly" | "yearly") => {
    return amount * frequencyMultipliers[frequency];
  };

  // Calculate metrics
  const totalAssets = data.accounts
    .filter(a => a.type === "asset")
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = data.accounts
    .filter(a => a.type === "liability")
    .reduce((sum, a) => sum + a.balance, 0);

  const netWorth = totalAssets - totalLiabilities;

  const monthlyIncome = data.income.reduce(
    (sum, inc) => sum + getMonthlyAmount(inc.amount, inc.frequency),
    0
  );

  const monthlyExpenses = data.expenses.reduce(
    (sum, exp) => sum + getMonthlyAmount(exp.amount, exp.frequency),
    0
  );

  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  // Expenses by category
  const expensesByCategory = data.expenses.reduce((acc, exp) => {
    const monthly = getMonthlyAmount(exp.amount, exp.frequency);
    if (!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += monthly;
    return acc;
  }, {} as { [key: string]: number });

  const categoryBreakdown = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / monthlyExpenses) * 100,
    }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Housing": "bg-error",
      "Utilities": "bg-warning",
      "Transportation": "bg-info",
      "Food & Dining": "bg-success",
      "Healthcare": "bg-accent",
      "Insurance": "bg-primary",
      "Entertainment": "bg-secondary",
      "Personal": "bg-neutral",
      "Other": "bg-base-300",
    };
    return colors[category] || "bg-base-300";
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar onReset={() => {}} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
          <p className="text-sm sm:text-base text-base-content/60 mt-1">Insights into your financial health and monthly patterns</p>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div className="card bg-gradient-to-br from-success/20 to-success/5 border border-success/30">
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] sm:text-xs font-semibold text-success/70 uppercase tracking-wider">Net Worth</div>
                  <div className="text-lg sm:text-2xl font-bold text-success mt-1 break-words">{formatCurrency(netWorth)}</div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success/20 flex items-center justify-center shrink-0 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-success">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30">
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] sm:text-xs font-semibold text-accent/70 uppercase tracking-wider">Monthly Income</div>
                  <div className="text-lg sm:text-2xl font-bold text-accent mt-1 break-words">{formatCurrency(monthlyIncome)}</div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-accent">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-error/20 to-error/5 border border-error/30">
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] sm:text-xs font-semibold text-error/70 uppercase tracking-wider">Monthly Expenses</div>
                  <div className="text-lg sm:text-2xl font-bold text-error mt-1 break-words">{formatCurrency(monthlyExpenses)}</div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-error/20 flex items-center justify-center shrink-0 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-error">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={`card bg-gradient-to-br ${monthlySavings >= 0 ? 'from-primary/20 to-primary/5 border-primary/30' : 'from-warning/20 to-warning/5 border-warning/30'} border`}>
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className={`text-[10px] sm:text-xs font-semibold ${monthlySavings >= 0 ? 'text-primary/70' : 'text-warning/70'} uppercase tracking-wider`}>Monthly Savings</div>
                  <div className={`text-lg sm:text-2xl font-bold ${monthlySavings >= 0 ? 'text-primary' : 'text-warning'} mt-1 break-words`}>{formatCurrency(monthlySavings)}</div>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${monthlySavings >= 0 ? 'bg-primary/20' : 'bg-warning/20'} flex items-center justify-center shrink-0 ml-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 sm:w-6 sm:h-6 ${monthlySavings >= 0 ? 'text-primary' : 'text-warning'}`}>
                    <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zm7.49-8.931a.75.75 0 01-.175 1.046 19.326 19.326 0 00-3.398 3.098.75.75 0 01-1.097.04L8.5 8.561l-2.22 2.22A.75.75 0 115.22 9.72l2.75-2.75a.75.75 0 011.06 0l1.664 1.663a20.786 20.786 0 013.122-2.74.75.75 0 011.046.176z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Income vs Expenses Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Savings Rate */}
          <div className="card bg-base-100 border border-base-content/10 shadow-lg">
            <div className="card-body">
              <div className="flex items-center gap-2">
                <h3 className="card-title text-lg">Savings Rate</h3>
                <div className="tooltip tooltip-right" data-tip="Formula: (Monthly Income - Monthly Expenses) ÷ Monthly Income × 100. Shows what percentage of your income you're saving.">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-base-content/40 hover:text-base-content/60 cursor-help">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-base-content/60 mb-4">
                Percentage of income saved each month
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Current Rate</span>
                    <span className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-success' : savingsRate >= 10 ? 'text-warning' : 'text-error'}`}>
                      {savingsRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-base-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${savingsRate >= 20 ? 'bg-success' : savingsRate >= 10 ? 'bg-warning' : 'bg-error'}`}
                      style={{ width: `${Math.min(savingsRate, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Goal</div>
                    <div className="text-sm font-semibold">20%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Good</div>
                    <div className="text-sm font-semibold">10-20%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/60">Needs Work</div>
                    <div className="text-sm font-semibold">&lt;10%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Income vs Expenses Comparison */}
          <div className="card bg-base-100 border border-base-content/10 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">Income vs Expenses</h3>
              <p className="text-sm text-base-content/60 mb-4">
                Monthly comparison
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Income</span>
                    <span className="text-sm font-bold text-success">{formatCurrency(monthlyIncome)}</span>
                  </div>
                  <div className="w-full h-4 bg-base-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success transition-all duration-500"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Expenses</span>
                    <span className="text-sm font-bold text-error">{formatCurrency(monthlyExpenses)}</span>
                  </div>
                  <div className="w-full h-4 bg-base-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-error transition-all duration-500"
                      style={{ width: `${(monthlyExpenses / monthlyIncome) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                    <span className="text-sm font-medium">Net Monthly</span>
                    <span className={`text-lg font-bold ${monthlySavings >= 0 ? 'text-primary' : 'text-warning'}`}>
                      {formatCurrency(monthlySavings)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Breakdown */}
        <div className="card bg-base-100 border border-base-content/10 shadow-lg mb-8">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Spending Breakdown by Category</h3>

            <div className="space-y-4">
              {categoryBreakdown.map(({ category, amount, percentage }) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{formatCurrency(amount)}</span>
                      <span className="text-xs text-base-content/60 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-base-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColor(category)} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className={`card border ${totalAssets >= totalLiabilities * 2 ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-70">Asset to Debt Ratio</div>
                <div className="tooltip tooltip-right" data-tip="Formula: Total Assets ÷ Total Liabilities. Measures how many dollars of assets you have for every dollar of debt. A ratio of 2:1 or higher is excellent.">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-base-content/40 hover:text-base-content/60 cursor-help shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                {totalLiabilities > 0 ? (totalAssets / totalLiabilities).toFixed(2) : "∞"}:1
              </div>
              <div className="text-[10px] sm:text-xs mt-2 opacity-70">
                {totalAssets >= totalLiabilities * 2 ? "Excellent" : totalAssets >= totalLiabilities ? "Good" : "Needs Improvement"}
              </div>
            </div>
          </div>

          <div className={`card border ${savingsRate >= 20 ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-70">Emergency Fund</div>
                <div className="tooltip tooltip-right" data-tip="Formula: Total Assets ÷ Monthly Expenses. Shows how many months you could survive on savings if income stopped. Financial experts recommend 3-6 months.">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-base-content/40 hover:text-base-content/60 cursor-help shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                {monthlyExpenses > 0 ? Math.floor(totalAssets / monthlyExpenses) : 0} mo.
              </div>
              <div className="text-[10px] sm:text-xs mt-2 opacity-70">
                {totalAssets >= monthlyExpenses * 6 ? "Excellent" : totalAssets >= monthlyExpenses * 3 ? "Good" : "Needs Improvement"}
              </div>
            </div>
          </div>

          <div className={`card border ${netWorth >= 0 ? 'bg-success/10 border-success/30' : 'bg-error/10 border-error/30'}`}>
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-70">Financial Health</div>
                <div className="tooltip tooltip-left" data-tip="Grade based on Net Worth and Savings Rate: A+ = positive net worth + 20%+ savings rate, B = positive + 10%+ savings, C = positive net worth, D = negative net worth.">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-base-content/40 hover:text-base-content/60 cursor-help shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                {netWorth >= 0 && savingsRate >= 20 ? "A+" : netWorth >= 0 && savingsRate >= 10 ? "B" : netWorth >= 0 ? "C" : "D"}
              </div>
              <div className="text-[10px] sm:text-xs mt-2 opacity-70">
                {netWorth >= 0 && savingsRate >= 20 ? "Outstanding" : netWorth >= 0 ? "On Track" : "Needs Attention"}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <SidebarProvider>
      <AnalyticsPageContent />
    </SidebarProvider>
  );
}
