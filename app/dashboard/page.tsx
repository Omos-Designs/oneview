"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import MetricCard from "@/components/dashboard/MetricCard";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import { createClient } from "@/libs/supabase/client";
import Image from "next/image";
import AddBankAccountForm from "@/components/dashboard/AddBankAccountForm";
import AddCreditCardForm from "@/components/dashboard/AddCreditCardForm";
import AddExpenseForm from "@/components/dashboard/AddExpenseForm";
import AddSubscriptionForm from "@/components/dashboard/AddSubscriptionForm";
import AddIncomeForm from "@/components/dashboard/AddIncomeForm";

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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // State for all financial data
  const [accounts, setAccounts] = useState<any[]>([]);
  const [upcomingExpenses, setUpcomingExpenses] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [income, setIncome] = useState<any[]>([]);

  // Modal state
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<"" | "income" | "expense" | "subscription" | "bank-account" | "credit-card">("");

  // Income modal state (for dynamic paycheck amounts)
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [paymentAmounts, setPaymentAmounts] = useState<number[]>([]);
  const [baseAmount, setBaseAmount] = useState<string>("");

  // Subscription autocomplete state
  const [subscriptionInput, setSubscriptionInput] = useState("");
  const [showSubscriptionDropdown, setShowSubscriptionDropdown] = useState(false);
  const [selectedSubscriptionLogo, setSelectedSubscriptionLogo] = useState<string | null>(null);

  // Credit card autocomplete state
  const [cardInput, setCardInput] = useState("");
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [selectedCardLogo, setSelectedCardLogo] = useState<string | null>(null);
  const [creditCardBrands, setCreditCardBrands] = useState<Array<{ name: string; domain: string }>>([]);

  // Track which items are marked as received/paid
  const [receivedIncome, setReceivedIncome] = useState<Set<string | number>>(new Set());
  const [paidExpenses, setPaidExpenses] = useState<Set<number>>(new Set());
  const [paidSubscriptions, setPaidSubscriptions] = useState<Set<number>>(new Set());

  // Popular subscription services with Logo.dev domains
  const subscriptionServices = [
    { name: "Netflix", domain: "netflix.com" },
    { name: "Spotify", domain: "spotify.com" },
    { name: "Apple Music", domain: "apple.com" },
    { name: "Apple TV", domain: "apple.com" },
    { name: "Amazon Prime", domain: "amazon.com" },
    { name: "Disney+", domain: "disney.com" },
    { name: "Hulu", domain: "hulu.com" },
    { name: "HBO Max", domain: "hbo.com" },
    { name: "YouTube Premium", domain: "youtube.com" },
    { name: "Claude/Anthropic", domain: "anthropic.com" },
    { name: "Adobe Creative Cloud", domain: "adobe.com" },
    { name: "Microsoft 365", domain: "microsoft.com" },
    { name: "Dropbox", domain: "dropbox.com" },
    { name: "Google One", domain: "google.com" },
    { name: "GitHub", domain: "github.com" },
    { name: "ChatGPT Plus", domain: "openai.com" },
    { name: "Notion", domain: "notion.so" },
    { name: "Slack", domain: "slack.com" },
    { name: "Zoom", domain: "zoom.us" },
    { name: "Canva", domain: "canva.com" },
    { name: "LinkedIn Premium", domain: "linkedin.com" },
    { name: "Other", domain: null },
  ];

  // Filter subscription services based on input
  const getFilteredServices = () => {
    if (!subscriptionInput.trim()) return subscriptionServices;
    const query = subscriptionInput.toLowerCase();
    return subscriptionServices.filter(service =>
      service.name.toLowerCase().includes(query)
    );
  };

  // Fetch credit card brands from database when modal opens with credit-card type
  const fetchCreditCardBrands = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("credit_card_brands")
        .select("name, domain")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching credit card brands:", error);
        return;
      }

      if (data) {
        setCreditCardBrands(data);
      }
    } catch (error) {
      console.error("Error fetching credit card brands:", error);
    }
  };

  // Filter credit cards based on input
  const getFilteredCards = () => {
    if (!cardInput.trim()) return creditCardBrands;
    const query = cardInput.toLowerCase();
    return creditCardBrands.filter(card =>
      card.name.toLowerCase().includes(query)
    );
  };

  // Handle credit card selection from dropdown
  const handleCardSelect = (card: { name: string; domain: string }) => {
    setCardInput(card.name);
    if (card.domain) {
      const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY || "";
      setSelectedCardLogo(`https://img.logo.dev/${card.domain}?token=${LOGO_DEV_KEY}`);
    } else {
      setSelectedCardLogo(null);
    }
    setShowCardDropdown(false);
  };

  // Handle subscription selection from dropdown
  const handleSubscriptionSelect = (service: typeof subscriptionServices[0]) => {
    setSubscriptionInput(service.name);
    if (service.domain) {
      const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY || "";
      setSelectedSubscriptionLogo(`https://img.logo.dev/${service.domain}?token=${LOGO_DEV_KEY}`);
    } else {
      setSelectedSubscriptionLogo(null);
    }
    setShowSubscriptionDropdown(false);
  };

  // Fetch user and all financial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        // Fetch bank accounts
        const { data: accountsData } = await supabase
          .from("bank_accounts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        setAccounts(accountsData || []);

        // Fetch income
        const { data: incomeData } = await supabase
          .from("income_sources")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        setIncome(incomeData || []);

        // Fetch all fixed expenses (they are all monthly recurring, so always show them)
        const { data: expensesData } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "expense") // Filter by type instead of category
          .order("due_date", { ascending: true });

        setUpcomingExpenses(expensesData || []);

        // Fetch subscriptions (expenses with type="subscription")
        const { data: subscriptionsData } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "subscription") // Filter by type instead of category
          .order("created_at", { ascending: true });

        setSubscriptions(subscriptionsData || []);

        // Fetch credit cards
        const { data: cardsData } = await supabase
          .from("credit_cards")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        setCreditCards(cardsData || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format dates without timezone conversion
  const formatDueDate = (dateStr: string): string => {
    try {
      // Parse YYYY-MM-DD directly without timezone conversion
      const [year, month, day] = dateStr.split('-').map(Number);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[month - 1]} ${day}`;
    } catch {
      return dateStr; // Fallback to original string if parsing fails
    }
  };

  // Toggle account active state
  const toggleAccount = async (id: number) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("bank_accounts")
      .update({ is_active: !account.is_active })
      .eq("id", id);

    if (!error) {
      setAccounts(accounts.map(acc =>
        acc.id === id ? { ...acc, is_active: !acc.is_active } : acc
      ));
    }
  };

  // Update account balance
  const updateAccountBalance = async (id: number, newBalance: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("bank_accounts")
      .update({ balance: newBalance })
      .eq("id", id);

    if (!error) {
      setAccounts(accounts.map(a =>
        a.id === id ? { ...a, balance: newBalance } : a
      ));
    }
  };

  // Update credit card balance
  const updateCreditCardBalance = async (id: number, newBalance: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("credit_cards")
      .update({ balance: newBalance })
      .eq("id", id);

    if (!error) {
      setCreditCards(creditCards.map(c =>
        c.id === id ? { ...c, balance: newBalance } : c
      ));
    }
  };

  // Toggle received/paid status (local state only for demo purposes)
  const toggleIncomeReceived = (id: string | number) => {
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

  // Handle frequency change and initialize payment amounts
  const handleFrequencyChange = (frequency: string, amount: string) => {
    setSelectedFrequency(frequency);

    if (frequency === "weekly") {
      const amountValue = parseFloat(amount) || 0;
      setPaymentAmounts(Array(4).fill(amountValue));
    } else if (frequency === "biweekly") {
      const amountValue = parseFloat(amount) || 0;
      setPaymentAmounts(Array(2).fill(amountValue));
    } else {
      setPaymentAmounts([]);
    }
  };

  // Update individual payment amount with cascading auto-fill
  const handlePaymentAmountChange = (index: number, value: string) => {
    const newAmounts = [...paymentAmounts];
    const parsedValue = parseFloat(value) || 0;
    newAmounts[index] = parsedValue;

    // Cascading auto-fill logic (forward-only propagation)
    if (selectedFrequency === "weekly") {
      // Week 1 (index 0) → auto-fills Weeks 2, 3, 4
      if (index === 0) {
        newAmounts[1] = parsedValue;
        newAmounts[2] = parsedValue;
        newAmounts[3] = parsedValue;
      }
      // Week 2 (index 1) → auto-fills Weeks 3, 4 (not Week 1)
      else if (index === 1) {
        newAmounts[2] = parsedValue;
        newAmounts[3] = parsedValue;
      }
      // Week 3 (index 2) → auto-fills Week 4 only
      else if (index === 2) {
        newAmounts[3] = parsedValue;
      }
      // Week 4 (index 3) → no auto-fill
    } else if (selectedFrequency === "biweekly") {
      // 1st Paycheck (index 0) → auto-fills 2nd Paycheck
      if (index === 0) {
        newAmounts[1] = parsedValue;
      }
      // 2nd Paycheck (index 1) → no auto-fill
    }

    setPaymentAmounts(newAmounts);
  };

  // Add Income (saves to database)
  const handleAddIncome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const supabase = createClient();
      const frequency = formData.get("frequency") as string;

      const { data, error} = await supabase
        .from("income_sources")
        .insert({
          user_id: user.id,
          source: formData.get("source") as string,
          amount: parseFloat(formData.get("amount") as string),
          frequency,
          category: formData.get("category") as string,
          amounts: (frequency === "weekly" || frequency === "biweekly") && paymentAmounts.length > 0 ? paymentAmounts : null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding income:", error);
        alert("Failed to add income. Please try again.");
        return;
      }

      if (data) {
        setIncome([...income, data]);
      }

      setShowAddTransactionModal(false);
      setSelectedEventType("");
      setSelectedFrequency("");
      setPaymentAmounts([]);
      setBaseAmount("");
      form.reset();
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income. Please try again.");
    }
  };

  // Add Expense (saves to database)
  const handleAddExpense = async (name: string, amount: number, dueDate: number, category: string) => {
    try {
      const supabase = createClient();

      // Calculate next occurrence of the due date
      const today = new Date();
      const currentDay = today.getDate();
      let targetYear = today.getFullYear();
      let targetMonth = today.getMonth(); // 0-11

      // If the due date already passed this month, use next month
      if (dueDate < currentDay) {
        targetMonth++;
        // Handle year rollover
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear++;
        }
      }

      // Create YYYY-MM-DD string (targetMonth is 0-11, so add 1)
      const dateString = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(dueDate).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          name,
          amount,
          due_date: dateString, // Use full date string instead of just day number
          category,
          type: "expense", // Set type for filtering
        })
        .select()
        .single();

      if (error) {
        console.error("Detailed error adding expense:", {
          error,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
          inputData: { name, amount, dueDate, category }
        });
        alert(`Failed to add expense: ${error.message}`);
        return;
      }

      if (data) {
        setUpcomingExpenses([...upcomingExpenses, data]);
      }

      setShowAddTransactionModal(false);
      setSelectedEventType("");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  // Add Subscription (saves to database as expense with category "Subscriptions")
  const handleAddSubscription = async (amount: number, dueDate: number, category: string) => {
    try {
      const supabase = createClient();

      // Use subscriptionInput for the name
      const name = subscriptionInput;
      const logo = selectedSubscriptionLogo;

      // Calculate next occurrence of the due date
      const today = new Date();
      const currentDay = today.getDate();
      let targetYear = today.getFullYear();
      let targetMonth = today.getMonth(); // 0-11

      // If the due date already passed this month, use next month
      if (dueDate < currentDay) {
        targetMonth++;
        // Handle year rollover
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear++;
        }
      }

      // Create YYYY-MM-DD string (targetMonth is 0-11, so add 1)
      const dateString = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(dueDate).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          name,
          amount,
          due_date: dateString, // Use full date string instead of just day number
          category, // Use the selected category
          type: "subscription", // Set type for filtering
          logo,
        })
        .select()
        .single();

      if (error) {
        console.error("Detailed error adding subscription:", {
          error,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
          inputData: { name, amount, dueDate, category: "Subscriptions" }
        });
        alert(`Failed to add subscription: ${error.message}`);
        return;
      }

      if (data) {
        setSubscriptions([...subscriptions, data]);
      }

      setShowAddTransactionModal(false);
      setSelectedEventType("");
      setSubscriptionInput("");
      setSelectedSubscriptionLogo(null);
      setShowSubscriptionDropdown(false);
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert("Failed to add subscription. Please try again.");
    }
  };

  // Add Credit Card (saves to database)
  const handleAddCreditCard = async (balance: number, dueDate: string) => {
    try {
      const supabase = createClient();

      // Use cardInput for the name and selectedCardLogo for the logo
      const logo = selectedCardLogo;

      const { data, error } = await supabase
        .from("credit_cards")
        .insert({
          user_id: user.id,
          name: cardInput,
          balance,
          due_date: dueDate,
          is_active: true,
          logo,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding credit card:", error);
        alert("Failed to add credit card. Please try again.");
        return;
      }

      if (data) {
        setCreditCards([...creditCards, data]);
      }

      setShowAddTransactionModal(false);
      setSelectedEventType("");
      setCardInput("");
      setSelectedCardLogo(null);
      setShowCardDropdown(false);
    } catch (error) {
      console.error("Error adding credit card:", error);
      alert("Failed to add credit card. Please try again.");
    }
  };

  // Calculations (excluding Cash accounts and respecting is_active)
  const currentCash = accounts
    .filter(a => a.is_active && a.name !== "Cash")
    .reduce((sum, a) => sum + Number(a.balance), 0);

  // Only count income that has NOT been received yet (unchecked)
  const upcomingIncome = income
    .reduce((sum, i) => {
      // For monthly income, check if the source ID is received
      if (i.frequency === 'monthly') {
        if (!receivedIncome.has(i.id)) {
          return sum + Number(i.amount);
        }
        return sum;
      }

      // For weekly income, check each individual paycheck ID
      if (i.frequency === 'weekly') {
        if (i.amounts && Array.isArray(i.amounts)) {
          const unreceived = i.amounts.reduce((acc: number, amt: number, index: number) => {
            const paymentId = `${i.id}_week_${index}`;
            if (!receivedIncome.has(paymentId)) {
              return acc + Number(amt);
            }
            return acc;
          }, 0);
          return sum + unreceived;
        }
        // Fallback if no amounts array
        if (!receivedIncome.has(i.id)) {
          return sum + Number(i.amount);
        }
        return sum;
      }

      // For bi-weekly income, check each individual paycheck ID
      if (i.frequency === 'biweekly' || i.frequency === 'bi-weekly') {
        if (i.amounts && Array.isArray(i.amounts)) {
          const unreceived = i.amounts.reduce((acc: number, amt: number, index: number) => {
            const paymentId = `${i.id}_bi_${index}`;
            if (!receivedIncome.has(paymentId)) {
              return acc + Number(amt);
            }
            return acc;
          }, 0);
          return sum + unreceived;
        }
        // Fallback if no amounts array
        if (!receivedIncome.has(i.id)) {
          return sum + Number(i.amount);
        }
        return sum;
      }

      // For yearly or other frequencies, check source ID
      if (!receivedIncome.has(i.id)) {
        return sum + Number(i.amount);
      }
      return sum;
    }, 0);

  const forecastedCash = currentCash + upcomingIncome;

  // Only count expenses/subscriptions that have NOT been paid yet (unchecked)
  const totalExpenses = upcomingExpenses
    .filter(e => !paidExpenses.has(e.id))
    .reduce((sum, e) => sum + Number(e.amount), 0) +
    subscriptions
      .filter(s => !paidSubscriptions.has(s.id))
      .reduce((sum, s) => sum + Number(s.amount), 0) +
    creditCards
      .filter(c => c.is_active)
      .reduce((sum, c) => sum + Number(c.balance), 0);

  const monthEndBalance = forecastedCash - totalExpenses;

  // Display name
  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-base-100">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
          <TopBar />
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar />

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
                <h1 className="text-lg sm:text-xl font-bold truncate">Welcome back, {displayName}!</h1>
                <p className="text-xs text-base-content/60">
                  Here&apos;s your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
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
              trend={upcomingIncome > 0 ? { value: "18.5%", isPositive: true } : undefined}
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
                    {!showAddTransactionModal && (
                      <InfoIcon tooltip="Forecasted Cash minus Total Expenses = what you'll have left" />
                    )}
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
                      {!showAddTransactionModal && (
                        <InfoIcon tooltip="Your linked accounts. Check to include in Current Cash calculation." />
                      )}
                    </div>
                    <Link href="/dashboard/accounts" className="btn btn-xs btn-ghost text-xs">View All →</Link>
                  </div>
                  <div className="space-y-2">
                    {accounts.filter(account => account.name !== "Cash").length === 0 ? (
                      <div className="text-center py-8 text-base-content/60">
                        <p className="text-sm">No accounts yet. Add your first account to get started!</p>
                      </div>
                    ) : (
                      accounts.filter(account => account.name !== "Cash").map((account) => (
                        <div key={account.id}>
                          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-base-100/50 hover:bg-base-100 transition-colors">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={account.is_active}
                                onChange={() => toggleAccount(account.id)}
                                className="checkbox checkbox-sm checkbox-accent shrink-0"
                              />
                              {account.logo ? (
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                                  <Image
                                    src={account.logo}
                                    alt={account.name}
                                    width={32}
                                    height={32}
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
                                value={Number(account.balance).toFixed(2)}
                                onChange={(e) => {
                                  const newBalance = parseFloat(e.target.value) || 0;
                                  updateAccountBalance(account.id, newBalance);
                                }}
                                className="input input-xs sm:input-sm input-bordered w-20 sm:w-24 text-right font-bold text-xs sm:text-sm"
                              />
                            </div>
                          </div>
                          {!account.is_active && account.balance > 0 && (
                            <p className="text-[10px] sm:text-xs italic text-warning ml-8 sm:ml-11 mt-1">
                              Not included in Current Cash total
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Income Sources */}
              <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 flex-1">
                <div className="card-body p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <h3 className="text-xs sm:text-sm font-bold">Income Sources</h3>
                      {!showAddTransactionModal && (
                        <InfoIcon tooltip="Your recurring income streams that contribute to Forecasted Cash" />
                      )}
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
                  {income.length === 0 ? (
                    <div className="text-center py-8 text-base-content/60">
                      <p className="text-sm">No income sources yet. Add your first income to get started!</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden sm:grid sm:grid-cols-[auto_1fr_auto] gap-4 mb-2 px-2">
                        <p className="text-xs text-base-content/50">Received?</p>
                        <p className="text-xs text-base-content/50">Source</p>
                        <p className="text-xs text-base-content/50 text-right">Amount</p>
                      </div>
                      <div className="space-y-2">
                        {income
                          .flatMap((source) => {
                            // Calculate individual payment occurrences based on frequency
                            const payments = [];
                            const today = new Date();
                            const currentMonth = today.getMonth();
                            const currentYear = today.getFullYear();

                            if (source.frequency === "weekly" && source.amounts && source.amounts.length > 0) {
                              // Use stored amounts for weekly payments
                              source.amounts.forEach((amount: number, index: number) => {
                                const paymentDate = new Date(currentYear, currentMonth, 1 + (index * 7));
                                payments.push({
                                  ...source,
                                  paymentId: `${source.id}_week_${index}`,
                                  paymentDate,
                                  paymentLabel: `Week ${index + 1}`,
                                  individualAmount: amount
                                });
                              });
                            } else if (source.frequency === "biweekly" && source.amounts && source.amounts.length > 0) {
                              // Use stored amounts for bi-weekly payments
                              source.amounts.forEach((amount: number, index: number) => {
                                const paymentDate = new Date(currentYear, currentMonth, index === 0 ? 1 : 15);
                                payments.push({
                                  ...source,
                                  paymentId: `${source.id}_bi_${index}`,
                                  paymentDate,
                                  paymentLabel: index === 0 ? "1st Payment" : "2nd Payment",
                                  individualAmount: amount
                                });
                              });
                            } else {
                              // Monthly, yearly, etc - show as single payment
                              payments.push({
                                ...source,
                                paymentId: source.id,
                                paymentDate: new Date(currentYear, currentMonth, 1),
                                paymentLabel: "",
                                individualAmount: Number(source.amount)
                              });
                            }

                            return payments;
                          })
                          .sort((a, b) => {
                            const aChecked = receivedIncome.has(a.paymentId);
                            const bChecked = receivedIncome.has(b.paymentId);
                            if (aChecked === bChecked) {
                              // Sort by date if check status is the same
                              return a.paymentDate.getTime() - b.paymentDate.getTime();
                            }
                            return aChecked ? 1 : -1;
                          })
                          .map((payment) => {
                            const isReceived = receivedIncome.has(payment.paymentId);
                            return (
                              <div
                                key={payment.paymentId}
                                className={`flex items-center gap-2 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-4 p-2 rounded-lg bg-base-100/50 transition-all duration-300 ${
                                  isReceived ? "opacity-60" : ""
                                }`}
                              >
                                <button
                                  onClick={() => toggleIncomeReceived(payment.paymentId)}
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
                                      {payment.source}
                                      {payment.paymentLabel && ` - ${payment.paymentLabel}`}
                                    </p>
                                    <p className={`text-[10px] sm:text-xs text-base-content/60 ${isReceived ? "line-through" : ""}`}>
                                      {payment.paymentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                      {" • "}
                                      {payment.frequency}
                                    </p>
                                  </div>
                                </div>
                                <p className={`font-bold text-xs sm:text-sm text-success text-right shrink-0 ${isReceived ? "line-through" : ""}`}>
                                  +${payment.individualAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}
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
                      {!showAddTransactionModal && (
                        <InfoIcon tooltip="Bills and expenses due in the next 30 days" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-base-content/60">Next 30 days</p>
                  </div>
                  <Link href="/dashboard/expenses" className="btn btn-xs btn-ghost text-xs">View All →</Link>
                </div>
                {upcomingExpenses.length === 0 ? (
                  <div className="text-center py-8 text-base-content/60">
                    <p className="text-sm">No upcoming expenses. Add an expense to get started!</p>
                  </div>
                ) : (
                  <>
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
                          return aPaid ? 1 : -1;
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
                                  ${Number(expense.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                                <span className={`badge badge-xs sm:badge-sm badge-error text-[10px] sm:text-xs ${isPaid ? "line-through" : ""}`}>
                                  {formatDueDate(expense.due_date)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
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
                    {!showAddTransactionModal && (
                      <InfoIcon tooltip="Your recurring subscription services billed monthly" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-bold text-accent">
                      ${subscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-base-content/60">/month</p>
                  </div>
                </div>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-8 text-base-content/60">
                    <p className="text-sm">No subscriptions yet. Add a subscription to track recurring expenses!</p>
                  </div>
                ) : (
                  <>
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
                          return aPaid ? 1 : -1;
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
                                {subscription.logo ? (
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                                    <Image
                                      src={subscription.logo}
                                      alt={subscription.name}
                                      width={32}
                                      height={32}
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
                                      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                                    </svg>
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className={`font-semibold text-xs sm:text-sm truncate ${isPaid ? "line-through" : ""}`}>
                                    {subscription.name}
                                  </p>
                                  <p className={`text-[10px] sm:text-xs text-base-content/60 ${isPaid ? "line-through" : ""}`}>
                                    Due: {subscription.due_date ? formatDueDate(subscription.due_date) : 'N/A'}
                                  </p>
                                </div>
                              </div>
                              <p className={`font-bold text-xs sm:text-sm text-right shrink-0 ${isPaid ? "line-through" : ""}`}>
                                ${Number(subscription.amount).toFixed(2)}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Credit Card Balances */}
            <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10">
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold">Credit Card Balances</h3>
                    {!showAddTransactionModal && (
                      <InfoIcon tooltip="Outstanding credit card balances included in Total Expenses" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-bold text-warning">
                      ${creditCards.filter(c => c.is_active).reduce((sum, card) => sum + Number(card.balance), 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-base-content/60">total owed</p>
                  </div>
                </div>
                {creditCards.length === 0 ? (
                  <div className="text-center py-8 text-base-content/60">
                    <p className="text-sm">No credit cards yet. Add a credit card to track balances!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {creditCards.map((card) => (
                      <div
                        key={card.id}
                        className="p-2 rounded-lg bg-base-100/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {card.logo ? (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                                <img
                                  src={card.logo}
                                  alt={card.name}
                                  width={32}
                                  height={32}
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
                                  <path
                                    fillRule="evenodd"
                                    d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-xs sm:text-sm truncate">{card.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-base-content/60">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={Number(card.balance).toFixed(2)}
                              onChange={(e) => {
                                const newBalance = parseFloat(e.target.value) || 0;
                                updateCreditCardBalance(card.id, newBalance);
                              }}
                              className="input input-xs sm:input-sm input-bordered w-20 sm:w-24 text-right font-bold text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Event Modal - Will be completed in next section due to size */}
      {showAddTransactionModal && (
        <div className="modal modal-open z-[9999]">
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto relative z-[10000]">
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
                  setSubscriptionInput("");
                  setSelectedSubscriptionLogo(null);
                  setShowSubscriptionDropdown(false);
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
                onChange={(e) => {
                  const newType = e.target.value as typeof selectedEventType;
                  setSelectedEventType(newType);
                  // Load credit card brands when credit-card is selected (cached in state for session)
                  if (newType === "credit-card" && creditCardBrands.length === 0) {
                    fetchCreditCardBrands();
                  }
                }}
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

            {/* Rest of the modal forms will continue... */}
            {/* Due to file size limitations, I'll include the key forms */}

            {selectedEventType === "bank-account" && (
              <AddBankAccountForm
                onSuccess={(newAccount) => {
                  setAccounts([...accounts, newAccount]);
                  setShowAddTransactionModal(false);
                  setSelectedEventType("");
                }}
                onCancel={() => {
                  setShowAddTransactionModal(false);
                  setSelectedEventType("");
                }}
              />
            )}

            {selectedEventType === "credit-card" && (
              <AddCreditCardForm
                onSuccess={(newCard) => {
                  setCreditCards([...creditCards, newCard]);
                  setShowAddTransactionModal(false);
                  setSelectedEventType("");
                }}
                onCancel={() => {
                  setShowAddTransactionModal(false);
                  setSelectedEventType("");
                }}
              />
            )}

            {selectedEventType === "income" && (
              <form onSubmit={handleAddIncome} className="space-y-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Basic Information</h4>
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </div>
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
                </div>

                {/* Payment Details Section - Only show after frequency is selected */}
                {selectedFrequency && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">Payment Amounts</h4>
                      <span className="badge badge-sm badge-ghost">Required</span>
                    </div>
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
                  </div>
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

            {selectedEventType === "expense" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddExpense(
                    formData.get("name") as string,
                    parseFloat(formData.get("amount") as string),
                    parseInt(formData.get("dueDate") as string, 10),
                    formData.get("category") as string
                  );
                }}
                className="space-y-6"
              >
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Basic Information</h4>
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Expense Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Rent, Electric Bill, Car Insurance"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>

                {/* Payment Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Payment Details</h4>
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </div>
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
                        <span className="label-text-alt text-base-content/60">Day of month</span>
                      </label>
                      <input
                        type="number"
                        name="dueDate"
                        min="1"
                        max="31"
                        placeholder="1-31"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Category</span>
                      </label>
                      <select name="category" className="select select-bordered w-full" required>
                        <option value="">Select category...</option>
                        <option value="Housing">Housing</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

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
                    Add Expense
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
                    parseFloat(formData.get("amount") as string),
                    parseInt(formData.get("dueDate") as string, 10),
                    formData.get("category") as string
                  );
                }}
                className="space-y-6"
              >
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Basic Information</h4>
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Subscription Name</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={subscriptionInput}
                        onChange={(e) => {
                          setSubscriptionInput(e.target.value);
                          setShowSubscriptionDropdown(true);
                          setSelectedSubscriptionLogo(null);
                        }}
                        onFocus={() => setShowSubscriptionDropdown(true)}
                        onBlur={() => {
                          // Delay to allow clicking dropdown items
                          setTimeout(() => setShowSubscriptionDropdown(false), 200);
                        }}
                        placeholder="Type to search services or enter custom..."
                        className="input input-bordered w-full"
                        required
                      />
                      {/* Autocomplete dropdown */}
                      {showSubscriptionDropdown && subscriptionInput && (
                        <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-content/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {getFilteredServices().length > 0 ? (
                            <>
                              {getFilteredServices().map((service) => (
                                <button
                                  key={service.name}
                                  type="button"
                                  onClick={() => handleSubscriptionSelect(service)}
                                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-base-content/10 transition-colors text-left"
                                >
                                  {service.domain && (
                                    <Image
                                      src={`https://img.logo.dev/${service.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY || ""}`}
                                      alt={service.name}
                                      width={20}
                                      height={20}
                                      className="rounded"
                                    />
                                  )}
                                  <span className="font-medium">{service.name}</span>
                                </button>
                              ))}
                              {/* Custom option */}
                              {!subscriptionServices.find(s => s.name.toLowerCase() === subscriptionInput.toLowerCase()) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowSubscriptionDropdown(false);
                                    setSelectedSubscriptionLogo(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-base-content/10 transition-colors text-left border-t border-base-content/10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 text-base-content/60"
                                  >
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                  </svg>
                                  <div>
                                    <div className="font-medium">Use &ldquo;{subscriptionInput}&rdquo;</div>
                                    <div className="text-xs text-base-content/60">Add as custom subscription</div>
                                  </div>
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setShowSubscriptionDropdown(false);
                                setSelectedSubscriptionLogo(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-base-content/10 transition-colors text-left"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 text-base-content/60"
                              >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                              <div>
                                <div className="font-medium">Use &ldquo;{subscriptionInput}&rdquo;</div>
                                <div className="text-xs text-base-content/60">Add as custom subscription</div>
                              </div>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category *</span>
                    </label>
                    <select name="category" className="select select-bordered w-full" required>
                      <option value="">Select category...</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Software">Software</option>
                      <option value="Media">Media</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Payment Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Payment Details</h4>
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </div>
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
                        <span className="label-text font-medium">Renewal Date</span>
                        <span className="label-text-alt text-base-content/60">Day of month</span>
                      </label>
                      <input
                        type="number"
                        name="dueDate"
                        min="1"
                        max="31"
                        placeholder="1-31"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransactionModal(false);
                      setSelectedEventType("");
                      setSubscriptionInput("");
                      setSelectedSubscriptionLogo(null);
                      setShowSubscriptionDropdown(false);
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
          </div>
          <div className="modal-backdrop bg-black/50 z-[9999]" onClick={() => {
            setShowAddTransactionModal(false);
            setSelectedEventType("");
          }}></div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
