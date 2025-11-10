"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import MetricCard from "@/components/dashboard/MetricCard";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import DemoBanner from "@/components/dashboard/DemoBanner";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import Image from "next/image";

// Info icon component
const InfoIcon = ({ tooltip }: { tooltip: string }) => (
  <div className="tooltip tooltip-left" data-tip={tooltip}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4 text-base-content/40 hover:text-accent cursor-help"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  </div>
);

function DashboardContent() {
  const { isPinned } = useSidebar();

  // Default data
  const defaultAccounts = [
    { id: 1, name: "Chase Checking", balance: 3420.50, type: "Checking", active: true, provider: "Chase", logo: `https://img.logo.dev/chase.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
    { id: 2, name: "Ally Savings", balance: 2000.00, type: "Savings", active: false, provider: "Ally Bank", logo: `https://img.logo.dev/ally.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
  ];

  const defaultExpenses = [
    { id: 1, name: "Rent", amount: 1800, dueDate: "Dec 1", category: "Housing", logo: null },
    { id: 2, name: "Electric Bill", amount: 120, dueDate: "Dec 5", category: "Utilities", logo: null },
    { id: 3, name: "Internet", amount: 80, dueDate: "Dec 10", category: "Utilities", logo: `https://img.logo.dev/xfinity.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
    { id: 4, name: "Phone Bill", amount: 65, dueDate: "Dec 15", category: "Utilities", logo: `https://img.logo.dev/verizon.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
  ];

  const defaultSubscriptions = [
    { id: 1, name: "Netflix", amount: 15.99, frequency: "Monthly", logo: `https://img.logo.dev/netflix.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
    { id: 2, name: "Spotify", amount: 10.99, frequency: "Monthly", logo: `https://img.logo.dev/spotify.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
    { id: 3, name: "Amazon Prime", amount: 14.99, frequency: "Monthly", logo: `https://img.logo.dev/amazon.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
    { id: 4, name: "Disney+", amount: 7.99, frequency: "Monthly", logo: `https://img.logo.dev/disneyplus.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
  ];

  const defaultCreditCards = [
    { id: 1, name: "Chase Sapphire", balance: 850.25, limit: 10000, dueDate: "Dec 20", logo: `https://img.logo.dev/chase.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
    { id: 2, name: "American Express", balance: 425.50, limit: 5000, dueDate: "Dec 25", logo: `https://img.logo.dev/americanexpress.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
  ];

  const defaultIncome = [
    { id: 1, source: "Salary - Tech Corp", amount: 3200, frequency: "Bi-weekly", nextDate: "Dec 15" },
  ];

  // State
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [upcomingExpenses, setUpcomingExpenses] = useState(defaultExpenses);
  const [subscriptions, setSubscriptions] = useState(defaultSubscriptions);
  const [creditCards, setCreditCards] = useState(defaultCreditCards);
  const [income, setIncome] = useState(defaultIncome);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<"" | "income" | "expense" | "subscription" | "bank-account" | "credit-card">("");

  // Income modal state (for dynamic paycheck amounts)
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [paymentAmounts, setPaymentAmounts] = useState<number[]>([]);
  const [baseAmount, setBaseAmount] = useState<string>("");

  // Track which items are marked as received/paid
  const [receivedIncome, setReceivedIncome] = useState<Set<number>>(new Set());
  const [paidExpenses, setPaidExpenses] = useState<Set<number>>(new Set([3])); // Internet (id: 3) is checked by default
  const [paidSubscriptions, setPaidSubscriptions] = useState<Set<number>>(new Set([1, 2])); // Netflix (id: 1) and Spotify (id: 2) are checked by default

  // Toggle account active state
  const toggleAccount = (id: number) => {
    setAccounts(accounts.map(acc =>
      acc.id === id ? { ...acc, active: !acc.active } : acc
    ));
  };

  // Toggle received/paid status
  const toggleIncomeReceived = (id: number) => {
    setReceivedIncome((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleExpensePaid = (id: number) => {
    setPaidExpenses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSubscriptionPaid = (id: number) => {
    setPaidSubscriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Reset to defaults
  const handleReset = () => {
    setAccounts(defaultAccounts);
    setUpcomingExpenses(defaultExpenses);
    setSubscriptions(defaultSubscriptions);
    setCreditCards(defaultCreditCards);
    setIncome(defaultIncome);
    setReceivedIncome(new Set());
    setPaidExpenses(new Set([3])); // Internet (id: 3) is checked by default
    setPaidSubscriptions(new Set([1, 2])); // Netflix (id: 1) and Spotify (id: 2) are checked by default
  };

  // Handle frequency change and initialize payment amounts
  const handleFrequencyChange = (frequency: string, amount: string) => {
    setSelectedFrequency(frequency);

    if (frequency === "weekly") {
      // Initialize 4 payment amounts for weekly
      const amountValue = parseFloat(amount) || 0;
      setPaymentAmounts(Array(4).fill(amountValue));
    } else if (frequency === "biweekly") {
      // Initialize 2 payment amounts for biweekly
      const amountValue = parseFloat(amount) || 0;
      setPaymentAmounts(Array(2).fill(amountValue));
    } else if (frequency === "monthly") {
      setPaymentAmounts([]);
    } else {
      setPaymentAmounts([]);
    }
  };

  // Update individual payment amount
  const handlePaymentAmountChange = (index: number, value: string) => {
    const newAmounts = [...paymentAmounts];
    newAmounts[index] = parseFloat(value) || 0;
    setPaymentAmounts(newAmounts);
  };

  // Add Income
  const handleAddIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const frequency = formData.get("frequency") as string;
    const newIncome: any = {
      id: income.length + 1,
      source: formData.get("source") as string,
      amount: parseFloat(formData.get("amount") as string),
      frequency,
      category: formData.get("category") as string,
    };

    // Add individual amounts for weekly/biweekly
    if (frequency === "weekly" || frequency === "biweekly") {
      newIncome.amounts = paymentAmounts.length > 0 ? paymentAmounts : undefined;
    }

    setIncome([...income, newIncome]);
    setShowAddTransactionModal(false);
    setSelectedEventType("");
    setSelectedFrequency("");
    setPaymentAmounts([]);
    setBaseAmount("");
    form.reset();
  };

  // Add Expense
  const handleAddExpense = (name: string, amount: number, dueDate: string, category: string) => {
    const newExpense = {
      id: upcomingExpenses.length + 1,
      name,
      amount,
      dueDate,
      category,
      logo: null as string | null,
    };
    setUpcomingExpenses([...upcomingExpenses, newExpense]);
    setShowAddTransactionModal(false);
    setSelectedEventType("");
  };

  // Add Subscription
  const handleAddSubscription = (name: string, amount: number, frequency: string) => {
    const newSubscription = {
      id: subscriptions.length + 1,
      name,
      amount,
      frequency,
      logo: `https://img.logo.dev/${name.toLowerCase().replace(/\s+/g, '')}.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`,
    };
    setSubscriptions([...subscriptions, newSubscription]);
    setShowAddTransactionModal(false);
    setSelectedEventType("");
  };

  // Add Bank Account
  const handleAddBankAccount = (name: string, type: string, balance: number) => {
    const newAccount = {
      id: accounts.length + 1,
      name,
      type,
      balance,
      active: true,
      provider: name,
      logo: `https://img.logo.dev/${name.toLowerCase().replace(/\s+/g, '')}.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`,
    };
    setAccounts([...accounts, newAccount]);
    setShowAddTransactionModal(false);
    setSelectedEventType("");
  };

  // Add Credit Card
  const handleAddCreditCard = (name: string, balance: number, limit: number) => {
    const newCard = {
      id: creditCards.length + 1,
      name,
      balance,
      limit,
      dueDate: "Dec 1",
      logo: `https://img.logo.dev/${name.toLowerCase().replace(/\s+/g, '')}.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`,
    };
    setCreditCards([...creditCards, newCard]);
    setShowAddTransactionModal(false);
    setSelectedEventType("");
  };

  // Calculations (excluding Cash accounts)
  const currentCash = accounts.filter(a => a.active && a.name !== "Cash").reduce((sum, a) => sum + a.balance, 0);
  // Only count income that has NOT been received yet (unchecked) - checked means already received and in bank accounts
  const upcomingIncome = income
    .filter(i => !receivedIncome.has(i.id))
    .reduce((sum, i) => sum + i.amount, 0);
  const forecastedCash = currentCash + upcomingIncome;
  // Only count expenses/subscriptions that have NOT been paid yet (unchecked)
  const totalExpenses = upcomingExpenses
    .filter(e => !paidExpenses.has(e.id))
    .reduce((sum, e) => sum + e.amount, 0) +
    subscriptions
      .filter(s => !paidSubscriptions.has(s.id))
      .reduce((sum, s) => sum + s.amount, 0) +
    creditCards.reduce((sum, c) => sum + c.balance, 0);
  const monthEndBalance = forecastedCash - totalExpenses;

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar onReset={handleReset} />

        <main className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 sm:w-8 sm:h-8 text-accent"
                >
                  <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">Welcome back, Demo User!</h1>
                <p className="text-xs text-base-content/60">
                  Here&apos;s your financial overview for December 2025
                </p>
              </div>
            </div>

            <button onClick={() => setShowAddTransactionModal(true)} className="btn btn-accent btn-sm gap-2 w-full sm:w-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Event
            </button>
          </div>

          {/* Manual Mode Banner */}
          <DemoBanner />

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Current Cash"
              value={`$${currentCash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle="Across active accounts"
              tooltip="Sum of all account balances marked as 'active' in your account list"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Forecasted Cash"
              value={`$${forecastedCash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle={`+$${upcomingIncome.toLocaleString()} expected income`}
              tooltip="Current Cash + all upcoming income expected this month"
              trend={{ value: "18.5%", isPositive: true }}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              }
            />
            <MetricCard
              title="Total Expenses"
              value={`$${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle="This month"
              tooltip="Sum of upcoming bills, subscriptions, and credit card balances"
              trend={{ value: "3.2%", isPositive: false }}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            {/* Month End Balance with Dynamic Gradient */}
            <div
              className="card backdrop-blur-sm border border-base-content/10 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: monthEndBalance < 0
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))'
                  : monthEndBalance < 500
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05))'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))'
              }}
            >
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-base-content/70 uppercase tracking-wider">
                      Month End Balance
                    </h3>
                    <InfoIcon tooltip="Forecasted Cash minus Total Expenses = what you'll have left" />
                  </div>
                  <div className={monthEndBalance < 0 ? "text-error" : monthEndBalance < 500 ? "text-warning" : "text-success"}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight break-words ${monthEndBalance < 0 ? "text-error" : monthEndBalance < 500 ? "text-warning" : "text-success"}`}>
                    ${monthEndBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {monthEndBalance >= 500 ? "You're in the green!" : monthEndBalance >= 0 ? "Getting close to zero" : "You're in the red"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Balances & Income + Upcoming Expenses Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Account Balances + Income Sources */}
            <div className="flex flex-col gap-4">
              {/* Account Balances */}
              <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 flex-1">
                <div className="card-body p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <h3 className="text-xs sm:text-sm font-bold">Account Balances</h3>
                      <InfoIcon tooltip="Your linked accounts. Check to include in Current Cash calculation." />
                    </div>
                    <Link href="/demo-dashboard/accounts" className="btn btn-xs btn-ghost text-xs">View All →</Link>
                  </div>
                  <div className="space-y-2">
                    {accounts.filter(account => account.name !== "Cash").map((account) => (
                      <div key={account.id}>
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-base-100/50 hover:bg-base-100 transition-colors">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={account.active}
                              onChange={() => toggleAccount(account.id)}
                              className="checkbox checkbox-sm checkbox-accent shrink-0"
                            />
                            {account.logo ? (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                                <Image
                                  src={account.logo}
                                  alt={account.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-base-content/10 flex items-center justify-center shrink-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                >
                                  <path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25v9c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125v-9H1z" />
                                </svg>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-xs sm:text-sm truncate">{account.name}</p>
                              <p className="text-[10px] sm:text-xs text-base-content/60">{account.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-base-content/60">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={account.balance.toFixed(2)}
                              onChange={(e) => {
                                const newBalance = parseFloat(e.target.value) || 0;
                                setAccounts(accounts.map(a =>
                                  a.id === account.id ? { ...a, balance: newBalance } : a
                                ));
                              }}
                              className="input input-xs sm:input-sm input-bordered w-20 sm:w-24 text-right font-bold text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                        {!account.active && account.balance > 0 && (
                          <p className="text-[10px] sm:text-xs italic text-warning ml-8 sm:ml-11 mt-1">
                            Not included in Current Cash total
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Income Sources */}
              <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 flex-1">
                <div className="card-body p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <h3 className="text-xs sm:text-sm font-bold">Income Sources</h3>
                      <InfoIcon tooltip="Your recurring income streams that contribute to Forecasted Cash" />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEventType("income");
                        setShowAddTransactionModal(true);
                      }}
                      className="btn btn-xs btn-accent btn-outline w-full sm:w-auto"
                    >
                      + Add Income
                    </button>
                  </div>
                  <div className="hidden sm:grid sm:grid-cols-[auto_1fr_auto] gap-4 mb-2 px-2">
                    <p className="text-xs text-base-content/50">Received?</p>
                    <p className="text-xs text-base-content/50">Source</p>
                    <p className="text-xs text-base-content/50 text-right">Amount</p>
                  </div>
                  <div className="space-y-2">
                    {income
                      .sort((a, b) => {
                        const aChecked = receivedIncome.has(a.id);
                        const bChecked = receivedIncome.has(b.id);
                        if (aChecked === bChecked) return 0;
                        return aChecked ? 1 : -1; // Move checked items to bottom
                      })
                      .map((source) => {
                        const isReceived = receivedIncome.has(source.id);
                        return (
                          <div
                            key={source.id}
                            className={`flex items-center gap-2 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-4 p-2 rounded-lg bg-base-100/50 transition-all duration-300 ${
                              isReceived ? "opacity-60" : ""
                            }`}
                          >
                            <button
                              onClick={() => toggleIncomeReceived(source.id)}
                              className={`btn btn-circle btn-xs transition-all shrink-0 ${
                                isReceived
                                  ? "btn-accent"
                                  : "btn-ghost border border-base-content/20"
                              }`}
                              title={isReceived ? "Mark as not received" : "Mark as received"}
                            >
                              {isReceived ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <span className="text-base-content/30 text-xs">✓</span>
                              )}
                            </button>
                            <div className="flex items-center gap-2 min-w-0 flex-1 sm:pl-6">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-success"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`font-semibold text-xs sm:text-sm truncate ${isReceived ? "line-through" : ""}`}>
                                  {source.source}
                                </p>
                                <p className={`text-[10px] sm:text-xs text-base-content/60 ${isReceived ? "line-through" : ""}`}>
                                  {source.frequency} • Next: {source.nextDate}
                                </p>
                              </div>
                            </div>
                            <p className={`font-bold text-xs sm:text-sm text-success text-right shrink-0 ${isReceived ? "line-through" : ""}`}>
                              +${source.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Upcoming Expenses */}
            <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10">
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <h3 className="text-xs sm:text-sm font-bold">Upcoming Expenses</h3>
                      <InfoIcon tooltip="Bills and expenses due in the next 30 days" />
                    </div>
                    <p className="text-[10px] sm:text-xs text-base-content/60">Next 30 days</p>
                  </div>
                  <Link href="/demo-dashboard/expenses" className="btn btn-xs btn-ghost text-xs">View All →</Link>
                </div>
                <div className="hidden sm:grid sm:grid-cols-[auto_1fr_auto] gap-4 mb-2 px-2">
                  <p className="text-xs text-base-content/50">Paid?</p>
                  <p className="text-xs text-base-content/50">Expense</p>
                  <p className="text-xs text-base-content/50 text-right">Amount</p>
                </div>
                <div className="space-y-2">
                  {upcomingExpenses
                    .sort((a, b) => {
                      const aPaid = paidExpenses.has(a.id);
                      const bPaid = paidExpenses.has(b.id);
                      if (aPaid === bPaid) return 0;
                      return aPaid ? 1 : -1; // Move checked items to bottom
                    })
                    .map((expense) => {
                      const isPaid = paidExpenses.has(expense.id);
                      return (
                        <div
                          key={expense.id}
                          className={`flex items-center gap-2 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-4 p-2 rounded-lg bg-base-100/50 hover:bg-base-100 transition-all duration-300 ${
                            isPaid ? "opacity-60" : ""
                          }`}
                        >
                          <button
                            onClick={() => toggleExpensePaid(expense.id)}
                            className={`btn btn-circle btn-xs transition-all shrink-0 ${
                              isPaid
                                ? "btn-accent"
                                : "btn-ghost border border-base-content/20"
                            }`}
                            title={isPaid ? "Mark as not paid" : "Mark as paid"}
                          >
                            {isPaid ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 sm:w-4 sm:h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="text-base-content/30 text-xs">✓</span>
                            )}
                          </button>
                          <div className="flex items-center gap-2 min-w-0 flex-1 sm:pl-2">
                            {expense.logo ? (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                                <Image
                                  src={expense.logo}
                                  alt={expense.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-error"
                                >
                                  <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />
                                </svg>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className={`font-semibold text-xs sm:text-sm truncate ${isPaid ? "line-through" : ""}`}>
                                {expense.name}
                              </p>
                              <p className={`text-[10px] sm:text-xs text-base-content/60 ${isPaid ? "line-through" : ""}`}>
                                {expense.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`font-bold text-xs sm:text-sm ${isPaid ? "line-through" : ""}`}>
                              ${expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                            <span className={`badge badge-xs sm:badge-sm badge-error text-[10px] sm:text-xs ${isPaid ? "line-through" : ""}`}>
                              {expense.dueDate}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Subscriptions & Credit Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Subscriptions */}
            <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10">
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold">Monthly Subscriptions</h3>
                    <InfoIcon tooltip="Your recurring subscription services billed monthly" />
                  </div>
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-bold text-accent">
                      ${subscriptions.reduce((sum, sub) => sum + sub.amount, 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-base-content/60">/month</p>
                  </div>
                </div>
                {/* Column Headers */}
                <div className="hidden sm:grid sm:grid-cols-[auto_1fr_auto] gap-4 mb-2 px-2">
                  <p className="text-xs text-base-content/50">Paid?</p>
                  <p className="text-xs text-base-content/50">Subscription</p>
                  <p className="text-xs text-base-content/50 text-right">Amount</p>
                </div>
                <div className="space-y-2">
                  {subscriptions
                    .sort((a, b) => {
                      const aPaid = paidSubscriptions.has(a.id);
                      const bPaid = paidSubscriptions.has(b.id);
                      if (aPaid === bPaid) return 0;
                      return aPaid ? 1 : -1; // Move checked items to bottom
                    })
                    .map((subscription) => {
                      const isPaid = paidSubscriptions.has(subscription.id);
                      return (
                        <div
                          key={subscription.id}
                          className={`flex items-center gap-2 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-4 p-2 rounded-lg bg-base-100/50 hover:bg-base-100 transition-all duration-300 ${
                            isPaid ? "opacity-60" : ""
                          }`}
                        >
                          <button
                            onClick={() => toggleSubscriptionPaid(subscription.id)}
                            className={`btn btn-circle btn-xs transition-all shrink-0 ${
                              isPaid
                                ? "btn-accent"
                                : "btn-ghost border border-base-content/20"
                            }`}
                            title={isPaid ? "Mark as not paid" : "Mark as paid"}
                          >
                            {isPaid ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 sm:w-4 sm:h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="text-base-content/30 text-xs">✓</span>
                            )}
                          </button>
                          <div className="flex items-center gap-2 min-w-0 flex-1 sm:pl-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                              <Image
                                src={subscription.logo}
                                alt={subscription.name}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`font-semibold text-xs sm:text-sm truncate ${isPaid ? "line-through" : ""}`}>
                                {subscription.name}
                              </p>
                              <p className={`text-[10px] sm:text-xs text-base-content/60 ${isPaid ? "line-through" : ""}`}>
                                {subscription.frequency}
                              </p>
                            </div>
                          </div>
                          <p className={`font-bold text-xs sm:text-sm text-right shrink-0 ${isPaid ? "line-through" : ""}`}>
                            ${subscription.amount.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Credit Card Balances */}
            <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10">
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold">Credit Card Balances</h3>
                    <InfoIcon tooltip="Outstanding credit card balances included in Total Expenses" />
                  </div>
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-bold text-warning">
                      ${creditCards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-base-content/60">total owed</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {creditCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-2 rounded-lg bg-base-100/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                            <Image
                              src={card.logo}
                              alt={card.name}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs sm:text-sm truncate">{card.name}</p>
                            <p className="text-[10px] sm:text-xs text-base-content/60">Due {card.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-base-content/60">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={card.balance.toFixed(2)}
                            onChange={(e) => {
                              const newBalance = parseFloat(e.target.value) || 0;
                              setCreditCards(creditCards.map(c =>
                                c.id === card.id ? { ...c, balance: newBalance } : c
                              ));
                            }}
                            className="input input-xs sm:input-sm input-bordered w-20 sm:w-24 text-right font-bold text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Event Modal - Dynamic Form */}
      {showAddTransactionModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Add Event</h3>
                <p className="text-xs text-base-content/60 mt-1">Add income, expenses, accounts, or credit cards</p>
              </div>
              <button
                onClick={() => {
                  setShowAddTransactionModal(false);
                  setSelectedEventType("");
                  setSelectedFrequency("");
                  setPaymentAmounts([]);
                  setBaseAmount("");
                }}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Event Type Selector */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold text-base">Select Event Type</span>
              </label>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value as typeof selectedEventType)}
                className="select select-bordered select-lg w-full"
                required
              >
                <option value="">Choose what you want to add...</option>
                <option value="income">Income Source</option>
                <option value="expense">Fixed Expense (Rent, utilities, etc.)</option>
                <option value="subscription">Subscription (Netflix, Spotify, etc.)</option>
                <option value="bank-account">Bank Account</option>
                <option value="credit-card">Credit Card</option>
              </select>
            </div>

            {!selectedEventType && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-base-content/60">Select an event type above to get started</p>
              </div>
            )}

            {selectedEventType === "expense" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddExpense(
                    formData.get("name") as string,
                    parseFloat(formData.get("amount") as string),
                    formData.get("dueDate") as string,
                    formData.get("category") as string
                  );
                }}
                className="space-y-4"
              >
              {/* Basic Information Section */}
              <CollapsibleSection
                title="Basic Information"
                badge="Required"
                defaultOpen={true}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Expense Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Rent, Electric Bill, Internet"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category</span>
                    </label>
                    <select name="category" className="select select-bordered w-full" required>
                      <option value="">Select category...</option>
                      <option value="Housing">Housing</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Payment Details Section */}
              <CollapsibleSection
                title="Payment Details"
                badge="Required"
                defaultOpen={true}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Amount ($)</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      placeholder="0.00"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Due Date</span>
                    </label>
                    <input
                      type="text"
                      name="dueDate"
                      placeholder="e.g., Dec 20, 2025"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>
              </CollapsibleSection>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransactionModal(false);
                      setSelectedEventType("");
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Add Fixed Expense
                  </button>
                </div>
              </form>
            )}

            {selectedEventType === "income" && (
              <form onSubmit={handleAddIncome} className="space-y-4">
                {/* Basic Information Section */}
                <CollapsibleSection
                  title="Basic Information"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Income Source Name *</span>
                      </label>
                      <input
                        type="text"
                        name="source"
                        placeholder="e.g., Salary - Tech Corp, Freelance - Web Design"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Category *</span>
                      </label>
                      <select name="category" className="select select-bordered w-full" required>
                        <option value="">Select category...</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Business Income">Business Income</option>
                        <option value="Rental Income">Rental Income</option>
                        <option value="Side Hustle">Side Hustle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Payment Frequency *</span>
                      </label>
                      <select
                        name="frequency"
                        className="select select-bordered w-full"
                        value={selectedFrequency}
                        onChange={(e) => handleFrequencyChange(e.target.value, baseAmount)}
                        required
                      >
                        <option value="">Select frequency...</option>
                        <option value="weekly">Weekly (4 payments/month)</option>
                        <option value="biweekly">Bi-weekly (2 payments/month)</option>
                        <option value="monthly">Monthly (1 payment/month)</option>
                      </select>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Payment Details Section - Only show after frequency is selected */}
                {selectedFrequency && (
                  <CollapsibleSection
                    title="Payment Amounts"
                    badge="Required"
                    defaultOpen={true}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    {/* Monthly Payment */}
                    {selectedFrequency === "monthly" && (
                      <div className="space-y-3">
                        <p className="text-sm text-base-content/70">
                          Enter your monthly payment amount:
                        </p>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Monthly Amount *</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 font-medium">$</span>
                            <input
                              type="number"
                              name="amount"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="input input-bordered w-full pl-8"
                              value={baseAmount}
                              onChange={(e) => setBaseAmount(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Biweekly Payments */}
                    {selectedFrequency === "biweekly" && (
                      <div className="space-y-4">
                        <div className="alert alert-info">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current shrink-0 w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <div>
                            <h3 className="font-bold text-sm">Bi-weekly Income</h3>
                            <div className="text-xs">You&apos;ll receive 2 paychecks per month. Enter the amount for each paycheck below.</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[0, 1].map((index) => (
                            <div key={index} className="form-control">
                              <label className="label">
                                <span className="label-text font-medium">{index === 0 ? "1st" : "2nd"} Paycheck Amount *</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 font-medium">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={paymentAmounts[index] || ""}
                                  onChange={(e) => handlePaymentAmountChange(index, e.target.value)}
                                  className="input input-bordered w-full pl-8"
                                  placeholder="0.00"
                                  required
                                />
                              </div>
                              {index === 0 && (
                                <input type="hidden" name="amount" value={paymentAmounts[0] || 0} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Weekly Payments */}
                    {selectedFrequency === "weekly" && (
                      <div className="space-y-4">
                        <div className="alert alert-info">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current shrink-0 w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <div>
                            <h3 className="font-bold text-sm">Weekly Income</h3>
                            <div className="text-xs">You&apos;ll receive 4 paychecks per month. Enter the amount for each week below.</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="form-control">
                              <label className="label">
                                <span className="label-text font-medium">Week {index + 1} Amount *</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 font-medium">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={paymentAmounts[index] || ""}
                                  onChange={(e) => handlePaymentAmountChange(index, e.target.value)}
                                  className="input input-bordered w-full pl-8"
                                  placeholder="0.00"
                                  required
                                />
                              </div>
                              {index === 0 && (
                                <input type="hidden" name="amount" value={paymentAmounts[0] || 0} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CollapsibleSection>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransactionModal(false);
                      setSelectedEventType("");
                      setSelectedFrequency("");
                      setPaymentAmounts([]);
                      setBaseAmount("");
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Add Income Source
                  </button>
                </div>
              </form>
            )}

            {selectedEventType === "subscription" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddSubscription(
                    formData.get("name") as string,
                    parseFloat(formData.get("amount") as string),
                    formData.get("frequency") as string
                  );
                }}
                className="space-y-4"
              >
                {/* Basic Information Section */}
                <CollapsibleSection
                  title="Basic Information"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Subscription Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Netflix, Spotify, Gym Membership"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Payment Details Section */}
                <CollapsibleSection
                  title="Payment Details"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Amount ($)</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        step="0.01"
                        placeholder="0.00"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Billing Frequency</span>
                      </label>
                      <select name="frequency" className="select select-bordered w-full" required>
                        <option value="">Select frequency...</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                </CollapsibleSection>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransactionModal(false);
                      setSelectedEventType("");
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Add Subscription
                  </button>
                </div>
              </form>
            )}

            {selectedEventType === "bank-account" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddBankAccount(
                    formData.get("name") as string,
                    formData.get("type") as string,
                    parseFloat(formData.get("balance") as string)
                  );
                }}
                className="space-y-4"
              >
                {/* Basic Information Section */}
                <CollapsibleSection
                  title="Basic Information"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Bank/Institution Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Chase, Bank of America, Wells Fargo"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Account Type</span>
                      </label>
                      <select name="type" className="select select-bordered w-full" required>
                        <option value="">Select type...</option>
                        <option value="Checking">Checking</option>
                        <option value="Savings">Savings</option>
                        <option value="Money Market">Money Market</option>
                        <option value="CD">CD (Certificate of Deposit)</option>
                      </select>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Account Details Section */}
                <CollapsibleSection
                  title="Account Details"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Current Balance ($)</span>
                      </label>
                      <input
                        type="number"
                        name="balance"
                        step="0.01"
                        placeholder="0.00"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransactionModal(false);
                      setSelectedEventType("");
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Add Bank Account
                  </button>
                </div>
              </form>
            )}

            {selectedEventType === "credit-card" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddCreditCard(
                    formData.get("name") as string,
                    parseFloat(formData.get("balance") as string),
                    parseFloat(formData.get("limit") as string)
                  );
                }}
                className="space-y-4"
              >
                {/* Basic Information Section */}
                <CollapsibleSection
                  title="Basic Information"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Card Name/Issuer</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Chase Sapphire, Amex Platinum, Capital One"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Card Details Section */}
                <CollapsibleSection
                  title="Card Details"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Current Balance ($)</span>
                      </label>
                      <input
                        type="number"
                        name="balance"
                        step="0.01"
                        placeholder="0.00"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Credit Limit ($)</span>
                      </label>
                      <input
                        type="number"
                        name="limit"
                        step="0.01"
                        placeholder="0.00"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransactionModal(false);
                      setSelectedEventType("");
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Add Credit Card
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => {
            setShowAddTransactionModal(false);
            setSelectedEventType("");
          }}></div>
        </div>
      )}
    </div>
  );
}

export default function DemoDashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
