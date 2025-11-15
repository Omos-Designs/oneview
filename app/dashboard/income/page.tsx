"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import { createClient } from "@/libs/supabase/client";

interface IncomeSource {
  id: string;
  source: string;
  amount: number; // Default amount, used for monthly or as base for weekly/biweekly
  frequency: "weekly" | "biweekly" | "monthly";
  category: string;
  amounts?: number[]; // Individual payment amounts for weekly (4 items) or biweekly (2 items)
  user_id: string;
  created_at: string;
}

// Display row for the table (can represent one or multiple payments)
interface IncomeDisplayRow {
  sourceId: string;
  source: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly";
  category: string;
  paymentLabel?: string; // For weekly/biweekly: "Week 1", "1st Paycheck", etc.
  isExpanded?: boolean; // True for weekly/biweekly rows
  isFirstRow?: boolean; // True for the first row of each income source (for rowspan)
  rowSpan?: number; // Number of rows this source spans (1, 2, or 4)
}

function IncomePageContent() {
  const { isPinned } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState<IncomeSource[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingIncomeId, setDeletingIncomeId] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [paymentAmounts, setPaymentAmounts] = useState<number[]>([]);
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [editingRow, setEditingRow] = useState<string | null>(null); // Format: "sourceId-index"
  const [editingAmount, setEditingAmount] = useState<string>("");
  const [editPaymentAmounts, setEditPaymentAmounts] = useState<number[]>([]);

  useEffect(() => {
    fetchIncomeSources();
  }, []);

  async function fetchIncomeSources() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch income sources
      const { data: incomeData, error} = await supabase
        .from("income_sources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setIncome((incomeData || []) as IncomeSource[]);
    } catch (error) {
      console.error("Error fetching income sources:", error);
    } finally {
      setLoading(false);
    }
  }

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

  // Update individual payment amount (for Add modal)
  const handlePaymentAmountChange = (index: number, value: string) => {
    const newAmounts = [...paymentAmounts];
    newAmounts[index] = parseFloat(value) || 0;
    setPaymentAmounts(newAmounts);
  };

  // Start editing a table row
  const startEditingRow = (sourceId: string, index: number, currentAmount: number) => {
    setEditingRow(`${sourceId}-${index}`);
    setEditingAmount(currentAmount.toString());
  };

  // Save inline edit for individual payment row
  const saveInlineEdit = async (sourceId: string, paymentIndex: number) => {
    const source = income.find(inc => inc.id === sourceId);
    if (!source) return;

    const newAmount = parseFloat(editingAmount) || 0;

    if (source.frequency === "weekly") {
      const newAmounts = source.amounts || Array(4).fill(source.amount);
      newAmounts[paymentIndex] = newAmount;

      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("income_sources")
          .update({ amounts: newAmounts })
          .eq("id", sourceId);

        if (error) throw error;

        const updatedIncome = income.map(inc =>
          inc.id === sourceId ? { ...inc, amounts: newAmounts } : inc
        );
        setIncome(updatedIncome);
      } catch (error) {
        console.error("Error updating weekly amount:", error);
      }
    } else if (source.frequency === "biweekly") {
      const newAmounts = source.amounts || Array(2).fill(source.amount);
      newAmounts[paymentIndex] = newAmount;

      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("income_sources")
          .update({ amounts: newAmounts })
          .eq("id", sourceId);

        if (error) throw error;

        const updatedIncome = income.map(inc =>
          inc.id === sourceId ? { ...inc, amounts: newAmounts } : inc
        );
        setIncome(updatedIncome);
      } catch (error) {
        console.error("Error updating biweekly amount:", error);
      }
    }

    setEditingRow(null);
    setEditingAmount("");
  };

  // Cancel inline edit
  const cancelInlineEdit = () => {
    setEditingRow(null);
    setEditingAmount("");
  };

  const handleAddIncome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const frequency = formData.get("frequency") as IncomeSource["frequency"];

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newIncome = {
        user_id: user.id,
        source: formData.get("source") as string,
        amount: parseFloat(formData.get("amount") as string),
        frequency,
        category: formData.get("category") as string,
        amounts: (frequency === "weekly" || frequency === "biweekly") && paymentAmounts.length > 0 ? paymentAmounts : null,
      };

      const { error } = await supabase.from("income_sources").insert(newIncome);

      if (error) throw error;

      setShowAddModal(false);
      setSelectedFrequency(""); // Reset frequency selection
      setPaymentAmounts([]); // Reset payment amounts
      setBaseAmount(""); // Reset base amount
      form.reset();
      fetchIncomeSources();
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income source. Please try again.");
    }
  };

  const handleEditIncome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingIncome) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const frequency = formData.get("frequency") as IncomeSource["frequency"];

    try {
      const supabase = createClient();
      const updatedIncome = {
        source: formData.get("source") as string,
        amount: parseFloat(formData.get("amount") as string),
        frequency,
        category: formData.get("category") as string,
        amounts: (frequency === "weekly" || frequency === "biweekly") && editPaymentAmounts.length > 0
          ? editPaymentAmounts
          : null,
      };

      const { error } = await supabase
        .from("income_sources")
        .update(updatedIncome)
        .eq("id", editingIncome.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingIncome(null);
      setEditPaymentAmounts([]);
      fetchIncomeSources();
    } catch (error) {
      console.error("Error updating income:", error);
      alert("Failed to update income source. Please try again.");
    }
  };

  const openEditModal = (incomeSource: IncomeSource) => {
    setEditingIncome(incomeSource);
    setShowEditModal(true);

    // Initialize payment amounts for weekly/biweekly
    if (incomeSource.frequency === "weekly") {
      setEditPaymentAmounts(incomeSource.amounts || Array(4).fill(incomeSource.amount));
    } else if (incomeSource.frequency === "biweekly") {
      setEditPaymentAmounts(incomeSource.amounts || Array(2).fill(incomeSource.amount));
    } else {
      setEditPaymentAmounts([]);
    }
  };

  const openDeleteModal = (incomeId: string) => {
    setDeletingIncomeId(incomeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingIncomeId) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("income_sources")
        .delete()
        .eq("id", deletingIncomeId);

      if (error) throw error;

      setShowDeleteModal(false);
      setDeletingIncomeId(null);
      fetchIncomeSources();
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income source. Please try again.");
    }
  };

  // Calculate monthly equivalent for an income source
  const getMonthlyEquivalent = (incomeSource: IncomeSource): number => {
    if (incomeSource.frequency === "weekly") {
      // Sum all 4 weekly payments
      const amounts = incomeSource.amounts || Array(4).fill(incomeSource.amount);
      return amounts.reduce((sum, amt) => sum + amt, 0);
    } else if (incomeSource.frequency === "biweekly") {
      // Sum both biweekly payments
      const amounts = incomeSource.amounts || Array(2).fill(incomeSource.amount);
      return amounts.reduce((sum, amt) => sum + amt, 0);
    } else {
      // Monthly is just the amount itself
      return incomeSource.amount;
    }
  };

  // Generate display rows based on frequency
  const generateDisplayRows = (): IncomeDisplayRow[] => {
    const rows: IncomeDisplayRow[] = [];

    income.forEach((inc) => {
      if (inc.frequency === "weekly") {
        // Weekly: Show 4 rows (4 weeks per month)
        const amounts = inc.amounts || Array(4).fill(inc.amount);
        for (let week = 1; week <= 4; week++) {
          rows.push({
            sourceId: inc.id,
            source: inc.source,
            amount: amounts[week - 1] || inc.amount,
            frequency: inc.frequency,
            category: inc.category,
            paymentLabel: `Week ${week}`,
            isExpanded: true,
            isFirstRow: week === 1,
            rowSpan: 4,
          });
        }
      } else if (inc.frequency === "biweekly") {
        // Biweekly: Show 2 rows (2 paychecks per month)
        const amounts = inc.amounts || Array(2).fill(inc.amount);
        rows.push({
          sourceId: inc.id,
          source: inc.source,
          amount: amounts[0] || inc.amount,
          frequency: inc.frequency,
          category: inc.category,
          paymentLabel: "1st Paycheck",
          isExpanded: true,
          isFirstRow: true,
          rowSpan: 2,
        });
        rows.push({
          sourceId: inc.id,
          source: inc.source,
          amount: amounts[1] || inc.amount,
          frequency: inc.frequency,
          category: inc.category,
          paymentLabel: "2nd Paycheck",
          isExpanded: true,
          isFirstRow: false,
          rowSpan: 2,
        });
      } else {
        // Monthly: Show 1 row
        rows.push({
          sourceId: inc.id,
          source: inc.source,
          amount: inc.amount,
          frequency: inc.frequency,
          category: inc.category,
          isExpanded: false,
          isFirstRow: true,
          rowSpan: 1,
        });
      }
    });

    return rows;
  };

  const displayRows = generateDisplayRows();
  const totalMonthlyIncome = income.reduce((sum, inc) => sum + getMonthlyEquivalent(inc), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getFrequencyBadgeColor = (frequency: IncomeSource["frequency"]) => {
    const colors = {
      weekly: "badge-info",
      biweekly: "badge-primary",
      monthly: "badge-accent",
    };
    return colors[frequency];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-base-100">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
          <TopBar />
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
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

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Income Sources</h1>
            <p className="text-base-content/60 text-xs sm:text-sm mt-0.5 sm:mt-1">Track and manage your recurring income streams</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-accent btn-sm sm:btn-md gap-2 w-full sm:w-auto shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span className="hidden sm:inline">Add Income Source</span>
            <span className="sm:hidden">Add Income</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div className="card bg-success/10 border border-success/20">
            <div className="card-body p-3 sm:p-4">
              <div className="text-[10px] sm:text-xs font-semibold text-success/70 uppercase tracking-wider">Total Monthly Income</div>
              <div className="text-lg sm:text-2xl font-bold text-success break-words">
                {formatCurrency(totalMonthlyIncome)}
              </div>
              <div className="text-[10px] sm:text-xs text-base-content/60 mt-0.5 sm:mt-1">
                Across {income.length} income {income.length === 1 ? 'source' : 'sources'}
              </div>
            </div>
          </div>
          <div className="card bg-primary/10 border border-primary/20">
            <div className="card-body p-3 sm:p-4">
              <div className="text-[10px] sm:text-xs font-semibold text-primary/70 uppercase tracking-wider">Active Income Sources</div>
              <div className="text-lg sm:text-2xl font-bold text-primary">
                {income.length}
              </div>
              <div className="text-[10px] sm:text-xs text-base-content/60 mt-0.5 sm:mt-1">
                Currently tracked
              </div>
            </div>
          </div>
        </div>

        {/* Income Table */}
        <div className="card bg-base-100 border border-base-content/10 shadow-lg">
          {income.length === 0 ? (
            <div className="p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-16 h-16 mx-auto mb-4 text-base-content/40">
                <path fillRule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-bold mb-2">No income sources yet</h3>
              <p className="text-base-content/60 mb-4">Add your first income source to start tracking</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-accent btn-lg gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Add Your First Income Source
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr>
                      <th>Income Source</th>
                      <th>Category</th>
                      <th>Payment Period</th>
                      <th className="text-right">Amount</th>
                      <th>Frequency</th>
                      <th className="text-right">Monthly Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map((row, index) => (
                      <tr key={`${row.sourceId}-${index}`}>
                        {/* Source - NOT merged, show on every row */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                              <span className="text-success font-bold text-lg leading-none">$</span>
                            </div>
                            <div>
                              <div className="font-semibold">{row.source}</div>
                              {row.isExpanded && (
                                <div className="text-xs text-base-content/60 mt-0.5">
                                  {row.paymentLabel}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Category - NOT merged, show on every row */}
                        <td>
                          <span className="badge badge-ghost badge-sm">{row.category}</span>
                        </td>
                        {/* Payment Period - NOT merged, unique per row */}
                        <td>
                          {row.paymentLabel ? (
                            <span className="text-sm font-medium text-base-content/70">
                              {row.paymentLabel}
                            </span>
                          ) : (
                            <span className="text-sm text-base-content/40">—</span>
                          )}
                        </td>
                        <td className="text-right">
                          {row.isExpanded && editingRow === `${row.sourceId}-${index}` ? (
                            <div className="flex items-center justify-end gap-2">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editingAmount}
                                onChange={(e) => setEditingAmount(e.target.value)}
                                className="input input-bordered input-xs w-24 text-right"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const paymentIndex = row.frequency === "weekly"
                                      ? parseInt(row.paymentLabel?.replace("Week ", "") || "1") - 1
                                      : row.paymentLabel === "1st Paycheck" ? 0 : 1;
                                    saveInlineEdit(row.sourceId, paymentIndex);
                                  } else if (e.key === "Escape") {
                                    cancelInlineEdit();
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  const paymentIndex = row.frequency === "weekly"
                                    ? parseInt(row.paymentLabel?.replace("Week ", "") || "1") - 1
                                    : row.paymentLabel === "1st Paycheck" ? 0 : 1;
                                  saveInlineEdit(row.sourceId, paymentIndex);
                                }}
                                className="btn btn-ghost btn-xs text-success"
                                title="Save"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                onClick={cancelInlineEdit}
                                className="btn btn-ghost btn-xs text-error"
                                title="Cancel"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`font-semibold text-success ${row.isExpanded ? "cursor-pointer hover:underline" : ""}`}
                              onClick={() => {
                                if (row.isExpanded) {
                                  startEditingRow(row.sourceId, index, row.amount);
                                }
                              }}
                              title={row.isExpanded ? "Click to edit" : ""}
                            >
                              {formatCurrency(row.amount)}
                            </span>
                          )}
                        </td>
                        {/* Frequency - NOT merged, show on every row */}
                        <td>
                          <span className={`badge badge-sm ${getFrequencyBadgeColor(row.frequency)}`}>
                            {row.frequency.charAt(0).toUpperCase() + row.frequency.slice(1)}
                          </span>
                        </td>
                        {/* Monthly Equivalent - MERGED by income source */}
                        {row.isFirstRow && (
                          <td rowSpan={row.rowSpan} className="text-right align-middle">
                            <span className="font-semibold text-accent">
                              {formatCurrency(getMonthlyEquivalent(income.find(inc => inc.id === row.sourceId)!))}
                            </span>
                          </td>
                        )}
                        {/* Actions - MERGED by income source */}
                        {row.isFirstRow && (
                          <td rowSpan={row.rowSpan} className="align-middle">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditModal(income.find(i => i.id === row.sourceId)!)}
                                className="btn btn-ghost btn-xs"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(row.sourceId)}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden p-2 space-y-3">
                {income.map((incomeSource) => (
                  <div key={incomeSource.id} className="card bg-base-100/50 border border-base-content/10">
                    <div className="card-body p-3">
                      {/* Header with source name and actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                            <span className="text-success font-bold text-sm leading-none">$</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{incomeSource.source}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="badge badge-ghost badge-xs">{incomeSource.category}</span>
                              <span className={`badge badge-xs ${getFrequencyBadgeColor(incomeSource.frequency)}`}>
                                {incomeSource.frequency.charAt(0).toUpperCase() + incomeSource.frequency.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => openEditModal(incomeSource)}
                            className="btn btn-ghost btn-xs"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteModal(incomeSource.id)}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Monthly Total */}
                      <div className="flex items-center justify-between py-2 border-t border-base-content/10">
                        <span className="text-xs text-base-content/60">Monthly Total</span>
                        <span className="font-bold text-accent">{formatCurrency(getMonthlyEquivalent(incomeSource))}</span>
                      </div>

                      {/* Payment breakdown for weekly/biweekly */}
                      {incomeSource.frequency === "weekly" && (
                        <div className="space-y-1 mt-2">
                          <p className="text-[10px] text-base-content/50 uppercase tracking-wider">Weekly Payments</p>
                          <div className="grid grid-cols-2 gap-2">
                            {(incomeSource.amounts || Array(4).fill(incomeSource.amount)).map((amount, index) => (
                              <div key={index} className="flex justify-between text-xs bg-base-100 p-1.5 rounded">
                                <span className="text-base-content/60">Week {index + 1}</span>
                                <span className="font-semibold text-success">{formatCurrency(amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {incomeSource.frequency === "biweekly" && (
                        <div className="space-y-1 mt-2">
                          <p className="text-[10px] text-base-content/50 uppercase tracking-wider">Bi-weekly Payments</p>
                          <div className="grid grid-cols-2 gap-2">
                            {(incomeSource.amounts || Array(2).fill(incomeSource.amount)).map((amount, index) => (
                              <div key={index} className="flex justify-between text-xs bg-base-100 p-1.5 rounded">
                                <span className="text-base-content/60">{index === 0 ? "1st" : "2nd"} Check</span>
                                <span className="font-semibold text-success">{formatCurrency(amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {incomeSource.frequency === "monthly" && (
                        <div className="flex justify-between text-xs bg-base-100 p-1.5 rounded mt-2">
                          <span className="text-base-content/60">Monthly Payment</span>
                          <span className="font-semibold text-success">{formatCurrency(incomeSource.amount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Add Income Source</h3>
                <p className="text-xs text-base-content/60 mt-1">Track your recurring income streams</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFrequency("");
                  setPaymentAmounts([]);
                  setBaseAmount("");
                }}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

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
                    setShowAddModal(false);
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
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => {
            setShowAddModal(false);
            setSelectedFrequency("");
            setPaymentAmounts([]);
            setBaseAmount("");
          }}></div>
        </div>
      )}

      {/* Edit Income Modal */}
      {showEditModal && editingIncome && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Edit Income Source</h3>
                <p className="text-xs text-base-content/60 mt-1">Update your income source details</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingIncome(null);
                  setEditPaymentAmounts([]);
                }}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditIncome} className="space-y-4">
              {/* Basic Information Section */}
              <div className="space-y-4 p-4 rounded-lg border border-base-content/10 bg-base-200/30">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  Basic Information
                  <span className="badge badge-sm badge-ghost">Required</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Income Source Name *</span>
                    </label>
                    <input
                      type="text"
                      name="source"
                      defaultValue={editingIncome.source}
                      placeholder="e.g., Salary - Tech Corp, Freelance - Web Design"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category *</span>
                    </label>
                    <select name="category" defaultValue={editingIncome.category} className="select select-bordered w-full" required>
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
                      defaultValue={editingIncome.frequency}
                      className="select select-bordered w-full"
                      required
                      disabled
                    >
                      <option value="weekly">Weekly (4 payments/month)</option>
                      <option value="biweekly">Bi-weekly (2 payments/month)</option>
                      <option value="monthly">Monthly (1 payment/month)</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">Frequency cannot be changed after creation</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Details Section */}
              {editingIncome.frequency === "monthly" && (
                <div className="space-y-4 p-4 rounded-lg border border-base-content/10 bg-base-200/30">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    Payment Details
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </h4>
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
                        defaultValue={editingIncome.amount}
                        placeholder="0.00"
                        className="input input-bordered w-full pl-8"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Biweekly Payments */}
              {editingIncome.frequency === "biweekly" && (
                <div className="space-y-4 p-4 rounded-lg border border-base-content/10 bg-base-200/30">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    Bi-weekly Payment Details
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </h4>
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
                      <div className="text-xs">Update the amount for each of your 2 paychecks.</div>
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
                            value={editPaymentAmounts[index] || ""}
                            onChange={(e) => {
                              const newAmounts = [...editPaymentAmounts];
                              newAmounts[index] = parseFloat(e.target.value) || 0;
                              setEditPaymentAmounts(newAmounts);
                            }}
                            className="input input-bordered w-full pl-8"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        {index === 0 && (
                          <input type="hidden" name="amount" value={editPaymentAmounts[0] || 0} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weekly Payments */}
              {editingIncome.frequency === "weekly" && (
                <div className="space-y-4 p-4 rounded-lg border border-base-content/10 bg-base-200/30">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    Weekly Payment Details
                    <span className="badge badge-sm badge-ghost">Required</span>
                  </h4>
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
                      <div className="text-xs">Update the amount for each of your 4 weekly paychecks.</div>
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
                            value={editPaymentAmounts[index] || ""}
                            onChange={(e) => {
                              const newAmounts = [...editPaymentAmounts];
                              newAmounts[index] = parseFloat(e.target.value) || 0;
                              setEditPaymentAmounts(newAmounts);
                            }}
                            className="input input-bordered w-full pl-8"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        {index === 0 && (
                          <input type="hidden" name="amount" value={editPaymentAmounts[0] || 0} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingIncome(null);
                    setEditPaymentAmounts([]);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => {
            setShowEditModal(false);
            setEditingIncome(null);
            setEditPaymentAmounts([]);
          }}></div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg">Delete Income Source</h3>
            <p className="py-4">
              Are you sure you want to delete this income source? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingIncomeId(null);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => {
            setShowDeleteModal(false);
            setDeletingIncomeId(null);
          }}></div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function IncomePage() {
  return (
    <SidebarProvider>
      <IncomePageContent />
    </SidebarProvider>
  );
}
