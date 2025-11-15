"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import { createClient } from "@/libs/supabase/client";

function AddEventContent() {
  const { isPinned } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams?.get("type");
  const supabase = createClient();

  const [selectedEventType, setSelectedEventType] = useState<"" | "income" | "expense" | "subscription" | "bank-account" | "credit-card">(
    (typeParam as any) || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // List of major banks and financial institutions with their domains for logo.dev
  const bankInstitutions = [
    { name: "Chase", domain: "chase.com" },
    { name: "Bank of America", domain: "bankofamerica.com" },
    { name: "Wells Fargo", domain: "wellsfargo.com" },
    { name: "Citibank", domain: "citi.com" },
    { name: "US Bank", domain: "usbank.com" },
    { name: "PNC Bank", domain: "pnc.com" },
    { name: "Capital One", domain: "capitalone.com" },
    { name: "TD Bank", domain: "tdbank.com" },
    { name: "Truist", domain: "truist.com" },
    { name: "Charles Schwab", domain: "schwab.com" },
    { name: "Navy Federal Credit Union", domain: "navyfederal.org" },
    { name: "USAA", domain: "usaa.com" },
    { name: "Ally Bank", domain: "ally.com" },
    { name: "Marcus by Goldman Sachs", domain: "marcus.com" },
    { name: "Discover Bank", domain: "discover.com" },
    { name: "American Express", domain: "americanexpress.com" },
    { name: "Synchrony Bank", domain: "synchronybank.com" },
    { name: "M&T Bank", domain: "mtb.com" },
    { name: "KeyBank", domain: "key.com" },
    { name: "Regions Bank", domain: "regions.com" },
    { name: "Fifth Third Bank", domain: "53.com" },
    { name: "BMO Harris Bank", domain: "bmo.com" },
    { name: "Huntington Bank", domain: "huntington.com" },
    { name: "Citizens Bank", domain: "citizensbank.com" },
    { name: "Santander Bank", domain: "santanderbank.com" },
    { name: "SoFi", domain: "sofi.com" },
    { name: "Chime", domain: "chime.com" },
    { name: "Varo Bank", domain: "varomoney.com" },
    { name: "Current", domain: "current.com" },
    { name: "Axos Bank", domain: "axosbank.com" },
    { name: "Other", domain: "generic" }
  ];

  useEffect(() => {
    if (typeParam) {
      setSelectedEventType(typeParam as typeof selectedEventType);
    }
  }, [typeParam]);

  // Determine the cancel URL based on event type
  const getCancelUrl = () => {
    switch (selectedEventType) {
      case "income":
        return "/dashboard/income";
      case "expense":
        return "/dashboard/expenses";
      case "bank-account":
        return "/dashboard/accounts";
      case "credit-card":
        return "/dashboard/credit-cards";
      case "subscription":
      default:
        return "/dashboard";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to add events");
        router.push("/signin");
        return;
      }

      // Extract form data based on event type
      switch (selectedEventType) {
        case "bank-account": {
          const accountName = formData.get("accountName") as string;
          const financialProvider = formData.get("financialProvider") as string;
          const selectedBank = financialProvider
            ? bankInstitutions.find(b => b.name === financialProvider)
            : null;

          const newAccount = {
            user_id: user.id,
            name: accountName,
            balance: parseFloat(formData.get("balance") as string),
            type: formData.get("type") as string,
            is_active: true,
            provider: financialProvider || null,
            logo: selectedBank?.domain && selectedBank.domain !== "generic"
              ? `https://img.logo.dev/${selectedBank.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`
              : null
          };

          const { error } = await supabase
            .from("bank_accounts")
            .insert([newAccount]);

          if (error) {
            console.error("Error adding bank account:", error);
            alert("Failed to add bank account. Please try again.");
            return;
          }

          router.push("/dashboard/accounts");
          break;
        }

        case "credit-card": {
          const cardName = formData.get("cardName") as string;

          const newCard = {
            user_id: user.id,
            name: cardName,
            balance: parseFloat(formData.get("balance") as string),
            due_date: formData.get("dueDate") as string,
            is_active: true
          };

          const { error } = await supabase
            .from("credit_cards")
            .insert([newCard]);

          if (error) {
            console.error("Error adding credit card:", error);
            alert("Failed to add credit card. Please try again.");
            return;
          }

          router.push("/dashboard/credit-cards");
          break;
        }

        case "income": {
          const newIncome = {
            user_id: user.id,
            source: formData.get("source") as string,
            amount: parseFloat(formData.get("amount") as string),
            frequency: (formData.get("frequency") as string).toLowerCase(),
            category: formData.get("category") as string
          };

          const { error } = await supabase
            .from("income_sources")
            .insert([newIncome]);

          if (error) {
            console.error("Error adding income:", error);
            alert("Failed to add income. Please try again.");
            return;
          }

          router.push("/dashboard/income");
          break;
        }

        case "expense": {
          const newExpense = {
            user_id: user.id,
            name: formData.get("name") as string,
            amount: parseFloat(formData.get("amount") as string),
            due_date: formData.get("dueDate") as string, // Date string
            category: formData.get("category") as string
          };

          const { error } = await supabase
            .from("expenses")
            .insert([newExpense]);

          if (error) {
            console.error("Error adding expense:", error);
            alert("Failed to add expense. Please try again.");
            return;
          }

          router.push("/dashboard/expenses");
          break;
        }

        case "subscription": {
          const subscriptionName = formData.get("name") as string;
          const newSubscription = {
            user_id: user.id,
            name: subscriptionName,
            amount: parseFloat(formData.get("amount") as string),
            due_date: formData.get("dueDate") as string, // Date string
            category: "Subscriptions & Memberships",
            logo: `https://img.logo.dev/${subscriptionName.toLowerCase().replace(/\s+/g, "")}.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`
          };

          const { error } = await supabase
            .from("expenses")
            .insert([newSubscription]);

          if (error) {
            console.error("Error adding subscription:", error);
            alert("Failed to add subscription. Please try again.");
            return;
          }

          router.push("/dashboard");
          break;
        }

        default:
          router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar />

        <main className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Add Event</h1>
            <p className="text-base-content/60 mt-2">
              Add income, expenses, accounts, or credit cards
            </p>
          </div>

          <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 max-w-3xl">
            <div className="card-body">
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

              {selectedEventType === "income" && (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Income Source</span>
                      </label>
                      <input type="text" name="source" placeholder="e.g., Salary, Freelance" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Category</span>
                      </label>
                      <select name="category" className="select select-bordered" required>
                        <option value="">Select category...</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Business Income">Business Income</option>
                        <option value="Rental Income">Rental Income</option>
                        <option value="Side Hustle">Side Hustle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Payment Details" badge="Required" defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Amount ($)</span>
                        </label>
                        <input type="number" name="amount" step="0.01" placeholder="0.00" className="input input-bordered" required />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Frequency</span>
                        </label>
                        <select name="frequency" className="select select-bordered" required>
                          <option value="">Select...</option>
                          <option>Weekly</option>
                          <option>Bi-weekly</option>
                          <option>Monthly</option>
                          <option>Yearly</option>
                        </select>
                      </div>
                    </div>
                  </CollapsibleSection>

                  <div className="flex justify-end gap-2 pt-4">
                    <Link href={getCancelUrl()} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Income"}
                    </button>
                  </div>
                </form>
              )}

              {selectedEventType === "expense" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <CollapsibleSection title="Basic Information" badge="Required" defaultOpen={true}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Expense Name</span>
                      </label>
                      <input type="text" name="name" placeholder="e.g., Rent, Electric Bill" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Category</span>
                      </label>
                      <select name="category" className="select select-bordered" required>
                        <option value="">Select...</option>
                        <option>Housing</option>
                        <option>Utilities</option>
                        <option>Transportation</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Payment Details" badge="Required" defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Amount ($)</span>
                        </label>
                        <input type="number" name="amount" step="0.01" placeholder="0.00" className="input input-bordered" required />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Due Date</span>
                        </label>
                        <input type="date" name="dueDate" className="input input-bordered" required />
                      </div>
                    </div>
                  </CollapsibleSection>

                  <div className="flex justify-end gap-2 pt-4">
                    <Link href={getCancelUrl()} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Expense"}
                    </button>
                  </div>
                </form>
              )}

              {selectedEventType === "subscription" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <CollapsibleSection title="Basic Information" badge="Required" defaultOpen={true}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Subscription Name</span>
                      </label>
                      <input type="text" name="name" placeholder="e.g., Netflix, Spotify" className="input input-bordered" required />
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Payment Details" badge="Required" defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Amount ($)</span>
                        </label>
                        <input type="number" name="amount" step="0.01" placeholder="0.00" className="input input-bordered" required />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Next Billing Date</span>
                        </label>
                        <input type="date" name="dueDate" className="input input-bordered" required />
                      </div>
                    </div>
                  </CollapsibleSection>

                  <div className="flex justify-end gap-2 pt-4">
                    <Link href={getCancelUrl()} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Subscription"}
                    </button>
                  </div>
                </form>
              )}

              {selectedEventType === "bank-account" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <CollapsibleSection title="Basic Information" badge="Required" defaultOpen={true}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Account Name</span>
                      </label>
                      <input
                        type="text"
                        name="accountName"
                        placeholder="e.g., My Checking Account, Emergency Savings"
                        className="input input-bordered"
                        required
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Give your account a custom name to easily identify it
                        </span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Financial Provider</span>
                        <span className="label-text-alt text-base-content/60">Optional</span>
                      </label>
                      <select name="financialProvider" className="select select-bordered">
                        <option value="">Select your bank (optional)...</option>
                        {bankInstitutions.map((bank) => (
                          <option key={bank.domain} value={bank.name}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Select a provider to show their logo
                        </span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Account Type</span>
                      </label>
                      <select name="type" className="select select-bordered" required>
                        <option value="">Select...</option>
                        <option>Checking</option>
                        <option>Savings</option>
                        <option>Money Market</option>
                        <option>CD</option>
                      </select>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Account Details" badge="Required" defaultOpen={true}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Current Balance ($)</span>
                      </label>
                      <input type="number" name="balance" step="0.01" placeholder="0.00" className="input input-bordered" required />
                    </div>
                  </CollapsibleSection>

                  <div className="flex justify-end gap-2 pt-4">
                    <Link href={getCancelUrl()} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Bank Account"}
                    </button>
                  </div>
                </form>
              )}

              {selectedEventType === "credit-card" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <CollapsibleSection title="Basic Information" badge="Required" defaultOpen={true}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Card Name</span>
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        placeholder="e.g., Chase Sapphire Reserve, Amex Platinum"
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Card Details" badge="Required" defaultOpen={true}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Current Balance ($)</span>
                      </label>
                      <input type="number" name="balance" step="0.01" placeholder="0.00" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Payment Due Date</span>
                      </label>
                      <input type="text" name="dueDate" placeholder="e.g., 15th of each month" className="input input-bordered" required />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Enter when your payment is due (e.g., &quot;15th&quot;, &quot;End of month&quot;, &quot;Dec 20&quot;)
                        </span>
                      </label>
                    </div>
                  </CollapsibleSection>

                  <div className="flex justify-end gap-2 pt-4">
                    <Link href={getCancelUrl()} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Credit Card"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AddEventPage() {
  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AddEventContent />
      </Suspense>
    </SidebarProvider>
  );
}
