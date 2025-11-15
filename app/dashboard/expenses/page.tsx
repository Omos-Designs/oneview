"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import { createClient } from "@/libs/supabase/client";

interface Expense {
  id: string;
  name: string;
  amount: number;
  due_date: string; // Date string (e.g., "2025-01-15")
  category: string;
  type: "expense" | "subscription"; // Discriminator for filtering
  logo: string | null;
  user_id: string;
  created_at?: string;
}

function ExpensesPageContent() {
  const { isPinned} = useSidebar();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [paidExpenses, setPaidExpenses] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingType, setAddingType] = useState<"expense" | "subscription">("expense");

  // Subscription autocomplete state
  const [subscriptionInput, setSubscriptionInput] = useState("");
  const [showSubscriptionDropdown, setShowSubscriptionDropdown] = useState(false);
  const [selectedSubscriptionLogo, setSelectedSubscriptionLogo] = useState<string | null>(null);
  const [subscriptionServices, setSubscriptionServices] = useState<Array<{ name: string; domain: string | null }>>([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Fetch subscription services from database
  const fetchSubscriptionServices = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscription_services")
        .select("name, domain")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching subscription services:", error);
        return;
      }

      if (data) {
        setSubscriptionServices(data);
      }
    } catch (error) {
      console.error("Error fetching subscription services:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: expensesData, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      if (error) {
        console.error("Error fetching expenses:", error);
      } else {
        setExpenses(expensesData || []);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpensePaid = (id: string) => {
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

  // Filter subscription services based on input
  const getFilteredServices = () => {
    if (!subscriptionInput.trim()) return subscriptionServices;
    const query = subscriptionInput.toLowerCase();
    return subscriptionServices.filter(service =>
      service.name.toLowerCase().includes(query)
    );
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

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to add an expense");
        return;
      }

      // Use subscriptionInput for subscriptions, form data for expenses
      const name = addingType === "subscription"
        ? subscriptionInput
        : formData.get("name") as string;
      const amount = parseFloat(formData.get("amount") as string);
      const dueDate = parseInt(formData.get("dueDate") as string, 10);
      const category = formData.get("category") as string;

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

      // Use pre-selected logo for subscriptions
      const logo = addingType === "subscription" ? selectedSubscriptionLogo : null;

      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        name,
        amount,
        due_date: dateString, // Use full date string instead of just day number
        category, // Use the selected category for both expenses and subscriptions
        type: addingType, // "expense" or "subscription" - used for filtering
        logo,
      });

      if (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense. Please try again.");
        return;
      }

      setShowAddModal(false);
      form.reset();
      setSubscriptionInput("");
      setSelectedSubscriptionLogo(null);
      setShowSubscriptionDropdown(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense. Please try again.");
        return;
      }

      setPaidExpenses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  // Separate expenses and subscriptions by type field
  const fixedExpenses = expenses.filter(exp => exp.type === "expense");
  const subscriptions = expenses.filter(exp => exp.type === "subscription");

  const getDayFromDateString = (dateStr: string): number => {
    // Extract day from YYYY-MM-DD string without timezone conversion
    const [, , day] = dateStr.split('-').map(Number);
    return day;
  };

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th"; // Handles 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  // Calculate totals
  const totalAll = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const unpaidExpenses = expenses.filter((exp) => !paidExpenses.has(exp.id));
  const unpaidTotal = unpaidExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      // Expense categories
      Housing: "badge-primary",
      Utilities: "badge-info",
      Transportation: "badge-accent",
      Insurance: "badge-warning",
      // Subscription categories
      Entertainment: "badge-secondary",
      Software: "badge-accent",
      Media: "badge-secondary",
      Fitness: "badge-success",
      // Common
      Other: "badge-ghost",
    };
    return colors[category] || "badge-ghost";
  };

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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-base-100">
        <Sidebar />
        <div
          className={`flex-1 transition-all duration-300 ${
            isPinned ? "ml-64" : "ml-20"
          }`}
        >
          <TopBar />
          <div className="flex h-96 items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div
        className={`flex-1 transition-all duration-300 ${
          isPinned ? "ml-64" : "ml-20"
        }`}
      >
        <TopBar />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {/* Page Header */}
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Monthly Expenses</h1>
            <p className="text-sm sm:text-base text-base-content/60 mt-1">
              Track your fixed expenses and subscriptions
            </p>
          </div>

          {/* Overall Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-8">
            <div className="card bg-error/10 border border-error/20">
              <div className="card-body p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs font-semibold text-error/70 uppercase tracking-wider">
                  Total Monthly Expenses
                </div>
                <div className="text-lg sm:text-2xl font-bold text-error break-words">
                  {formatCurrency(totalAll)}
                </div>
                <div className="text-[10px] sm:text-xs text-base-content/60 mt-1">
                  {expenses.length} total expenses
                </div>
              </div>
            </div>
            <div className="card bg-warning/10 border border-warning/20">
              <div className="card-body p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs font-semibold text-warning/70 uppercase tracking-wider">
                  Unpaid This Month
                </div>
                <div className="text-lg sm:text-2xl font-bold text-warning break-words">
                  {formatCurrency(unpaidTotal)}
                </div>
                <div className="text-[10px] sm:text-xs text-base-content/60 mt-1">
                  {unpaidExpenses.length} remaining
                </div>
              </div>
            </div>
            <div className="card bg-success/10 border border-success/20">
              <div className="card-body p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs font-semibold text-success/70 uppercase tracking-wider">
                  Paid This Month
                </div>
                <div className="text-lg sm:text-2xl font-bold text-success break-words">
                  {paidExpenses.size}
                </div>
                <div className="text-[10px] sm:text-xs text-base-content/60 mt-1">
                  {paidExpenses.size} of {expenses.length} paid
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Layout for Fixed Expenses and Subscriptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Fixed Expenses Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold">Fixed Expenses</h2>
                  <p className="text-base-content/60 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Rent, utilities, and bills
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-accent btn-sm gap-2 w-full sm:w-auto shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add
                </button>
              </div>

              <div className="card bg-base-100 border border-base-content/10 shadow-lg">
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="table table-zebra table-sm">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Expense</th>
                        <th>Category</th>
                        <th className="text-right">Amount</th>
                        <th className="text-center">Due</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fixedExpenses.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-base-content/60">
                            No expenses yet
                          </td>
                        </tr>
                      ) : (
                        fixedExpenses
                          .sort((a, b) => {
                            const aPaid = paidExpenses.has(a.id);
                            const bPaid = paidExpenses.has(b.id);
                            if (aPaid === bPaid) {
                              // Sort by date string comparison
                              return a.due_date.localeCompare(b.due_date);
                            }
                            return aPaid ? 1 : -1;
                          })
                          .map((expense) => {
                            const isPaid = paidExpenses.has(expense.id);
                            return (
                              <tr key={expense.id} className={isPaid ? "opacity-50" : ""}>
                                <td>
                                  <button
                                    onClick={() => toggleExpensePaid(expense.id)}
                                    className={`btn btn-circle btn-xs ${
                                      isPaid
                                        ? "btn-success"
                                        : "btn-ghost border-2 border-base-content/20"
                                    }`}
                                  >
                                    {isPaid && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-3 h-3"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                </td>
                                <td>
                                  <div className="flex items-center gap-2">
                                    {expense.logo && (
                                      <div className="avatar">
                                        <div className="w-6 h-6">
                                          <img
                                            src={expense.logo}
                                            alt={expense.name}
                                            width={24}
                                            height={24}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <div className="font-semibold text-sm">{expense.name}</div>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge badge-xs ${getCategoryBadgeColor(
                                      expense.category
                                    )}`}
                                  >
                                    {expense.category}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className="font-semibold text-error text-sm">
                                    {formatCurrency(Number(expense.amount))}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="text-xs font-medium">
                                    {formatDueDate(expense.due_date)}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleDeleteExpense(expense.id)}
                                    className="btn btn-ghost btn-xs text-error"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden p-2 space-y-2">
                  {fixedExpenses.length === 0 ? (
                    <div className="text-center py-8 text-base-content/60 text-sm">
                      No expenses yet
                    </div>
                  ) : (
                    fixedExpenses
                      .sort((a, b) => {
                        const aPaid = paidExpenses.has(a.id);
                        const bPaid = paidExpenses.has(b.id);
                        if (aPaid === bPaid) {
                          return a.due_date.localeCompare(b.due_date);
                        }
                        return aPaid ? 1 : -1;
                      })
                      .map((expense) => {
                        const isPaid = paidExpenses.has(expense.id);
                        return (
                          <div
                            key={expense.id}
                            className={`flex items-center gap-2 p-2 rounded-lg bg-base-100/50 border border-base-content/10 ${
                              isPaid ? "opacity-50" : ""
                            }`}
                          >
                            <button
                              onClick={() => toggleExpensePaid(expense.id)}
                              className={`btn btn-circle btn-xs shrink-0 ${
                                isPaid
                                  ? "btn-success"
                                  : "btn-ghost border-2 border-base-content/20"
                              }`}
                            >
                              {isPaid && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {expense.logo && (
                                <div className="avatar">
                                  <div className="w-5 h-5">
                                    <img
                                      src={expense.logo}
                                      alt={expense.name}
                                      width={20}
                                      height={20}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-xs truncate">{expense.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span
                                    className={`badge badge-xs ${getCategoryBadgeColor(
                                      expense.category
                                    )}`}
                                  >
                                    {expense.category}
                                  </span>
                                  <span className="text-[10px] text-base-content/60">
                                    Due: {getDayFromDateString(expense.due_date)}
                                    {getOrdinalSuffix(getDayFromDateString(expense.due_date))}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="font-bold text-error text-sm">
                                {formatCurrency(Number(expense.amount))}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="btn btn-ghost btn-xs text-error shrink-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            {/* Subscriptions Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold">Subscriptions</h2>
                  <p className="text-base-content/60 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Streaming & services
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAddingType("subscription");
                    setShowAddModal(true);
                    setSubscriptionInput("");
                    setSelectedSubscriptionLogo(null);
                    setShowSubscriptionDropdown(false);
                    // Load subscription services from database (cached in state for session)
                    if (subscriptionServices.length === 0) {
                      fetchSubscriptionServices();
                    }
                  }}
                  className="btn btn-accent btn-sm gap-2 w-full sm:w-auto shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add
                </button>
              </div>

              <div className="card bg-base-100 border border-base-content/10 shadow-lg">
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="table table-zebra table-sm">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Service</th>
                        <th>Category</th>
                        <th className="text-right">Amount</th>
                        <th className="text-center">Due</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-base-content/60">
                            No subscriptions yet
                          </td>
                        </tr>
                      ) : (
                        subscriptions
                          .sort((a, b) => {
                            const aPaid = paidExpenses.has(a.id);
                            const bPaid = paidExpenses.has(b.id);
                            if (aPaid === bPaid) return Number(a.due_date) - Number(b.due_date);
                            return aPaid ? 1 : -1;
                          })
                          .map((subscription) => {
                            const isPaid = paidExpenses.has(subscription.id);
                            return (
                              <tr key={subscription.id} className={isPaid ? "opacity-50" : ""}>
                                <td>
                                  <button
                                    onClick={() => toggleExpensePaid(subscription.id)}
                                    className={`btn btn-circle btn-xs ${
                                      isPaid
                                        ? "btn-success"
                                        : "btn-ghost border-2 border-base-content/20"
                                    }`}
                                  >
                                    {isPaid && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-3 h-3"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                </td>
                                <td>
                                  <div className="flex items-center gap-2">
                                    {subscription.logo && (
                                      <div className="avatar">
                                        <div className="w-6 h-6">
                                          <img
                                            src={subscription.logo}
                                            alt={subscription.name}
                                            width={24}
                                            height={24}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <div className="font-semibold text-sm">{subscription.name}</div>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge badge-xs ${getCategoryBadgeColor(
                                      subscription.category
                                    )}`}
                                  >
                                    {subscription.category}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className="font-semibold text-error text-sm">
                                    {formatCurrency(Number(subscription.amount))}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="text-xs font-medium">
                                    {formatDueDate(subscription.due_date)}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleDeleteExpense(subscription.id)}
                                    className="btn btn-ghost btn-xs text-error"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden p-2 space-y-2">
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-8 text-base-content/60 text-sm">
                      No subscriptions yet
                    </div>
                  ) : (
                    subscriptions
                      .sort((a, b) => {
                        const aPaid = paidExpenses.has(a.id);
                        const bPaid = paidExpenses.has(b.id);
                        if (aPaid === bPaid) return Number(a.due_date) - Number(b.due_date);
                        return aPaid ? 1 : -1;
                      })
                      .map((subscription) => {
                        const isPaid = paidExpenses.has(subscription.id);
                        return (
                          <div
                            key={subscription.id}
                            className={`flex items-center gap-2 p-2 rounded-lg bg-base-100/50 border border-base-content/10 ${
                              isPaid ? "opacity-50" : ""
                            }`}
                          >
                            <button
                              onClick={() => toggleExpensePaid(subscription.id)}
                              className={`btn btn-circle btn-xs shrink-0 ${
                                isPaid
                                  ? "btn-success"
                                  : "btn-ghost border-2 border-base-content/20"
                              }`}
                            >
                              {isPaid && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {subscription.logo && (
                                <div className="avatar">
                                  <div className="w-5 h-5">
                                    <img
                                      src={subscription.logo}
                                      alt={subscription.name}
                                      width={20}
                                      height={20}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-xs truncate">
                                  {subscription.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span
                                    className={`badge badge-xs ${getCategoryBadgeColor(
                                      subscription.category
                                    )}`}
                                  >
                                    {subscription.category}
                                  </span>
                                  <span className="text-[10px] text-base-content/60">
                                    Due: {getDayFromDateString(subscription.due_date)}
                                    {getOrdinalSuffix(getDayFromDateString(subscription.due_date))}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="font-bold text-error text-sm">
                                {formatCurrency(Number(subscription.amount))}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteExpense(subscription.id)}
                              className="btn btn-ghost btn-xs text-error shrink-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Expense/Subscription Modal */}
        {showAddModal && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    {addingType === "expense" ? "Add Fixed Expense" : "Add Subscription"}
                  </h3>
                  <p className="text-xs text-base-content/60 mt-1">
                    {addingType === "expense"
                      ? "Track your recurring bills and fixed expenses"
                      : "Track your streaming services and memberships"}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Basic Information</h4>
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        {addingType === "expense" ? "Expense Name *" : "Service Name *"}
                      </span>
                    </label>
                    {addingType === "expense" ? (
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Rent, Electric Bill, Phone Bill"
                        className="input input-bordered"
                        required
                      />
                    ) : (
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
                                      <img
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
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category *</span>
                    </label>
                    <select name="category" className="select select-bordered" required>
                      <option value="">Select category...</option>
                      {addingType === "expense" ? (
                        <>
                          <option value="Housing">Housing</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Other">Other</option>
                        </>
                      ) : (
                        <>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Software">Software</option>
                          <option value="Media">Media</option>
                          <option value="Fitness">Fitness</option>
                          <option value="Other">Other</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Payment Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Payment Details</h4>
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Monthly Amount *</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          name="amount"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="input input-bordered w-full pl-8"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Due Date *</span>
                        <span className="label-text-alt text-base-content/60">
                          Day of month
                        </span>
                      </label>
                      <input
                        type="number"
                        name="dueDate"
                        min="1"
                        max="31"
                        placeholder="1-31"
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    {addingType === "expense" ? "Add Expense" : "Add Subscription"}
                  </button>
                </div>
              </form>
            </div>
            <div
              className="modal-backdrop bg-black/50"
              onClick={() => setShowAddModal(false)}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <SidebarProvider>
      <ExpensesPageContent />
    </SidebarProvider>
  );
}
