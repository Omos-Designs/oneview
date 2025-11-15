"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import Image from "next/image";
import { createClient } from "@/libs/supabase/client";
import AddBankAccountForm from "@/components/dashboard/AddBankAccountForm";

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  provider: string | null;
  logo: string | null;
  is_active: boolean;
  user_id: string;
  created_at: string;
};

function AccountsPageContent() {
  const { isPinned } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [bankInstitutions, setBankInstitutions] = useState<Array<{ name: string; domain: string }>>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch bank institutions from database (for Edit modal)
  async function fetchBankInstitutions() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bank_institutions")
        .select("name, domain")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching bank institutions:", error);
        return;
      }

      if (data) {
        setBankInstitutions(data);
      }
    } catch (error) {
      console.error("Error fetching bank institutions:", error);
    }
  }

  async function fetchAccounts() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch accounts
      const { data: accountsData, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAccounts(accountsData || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleAccount = async (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bank_accounts")
        .update({ is_active: !account.is_active })
        .eq("id", id);

      if (error) throw error;

      // Update local state immediately for better UX
      setAccounts(accounts.map(acc =>
        acc.id === id ? { ...acc, is_active: !acc.is_active } : acc
      ));
    } catch (error) {
      console.error("Error toggling account:", error);
    }
  };

  const updateBalance = async (id: string, newBalance: number) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bank_accounts")
        .update({ balance: newBalance })
        .eq("id", id);

      if (error) throw error;

      // Update local state immediately for better UX
      setAccounts(accounts.map(a =>
        a.id === id ? { ...a, balance: newBalance } : a
      ));
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setShowEditModal(true);
    // Load bank institutions from database when opening edit modal (cached in state for session)
    if (bankInstitutions.length === 0) {
      fetchBankInstitutions();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAccounts(accounts.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAccount) return;

    const formData = new FormData(e.currentTarget);
    const accountName = formData.get("accountName") as string;
    const financialProvider = formData.get("financialProvider") as string;
    const accountType = formData.get("type") as string;

    const selectedBank = financialProvider
      ? bankInstitutions.find(b => b.name === financialProvider)
      : null;

    const logo = selectedBank?.domain && selectedBank.domain !== "generic"
      ? `https://img.logo.dev/${selectedBank.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`
      : null;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bank_accounts")
        .update({
          name: accountName,
          type: accountType.toLowerCase(),
          provider: financialProvider || null,
          logo: logo
        })
        .eq("id", editingAccount.id);

      if (error) throw error;

      // Update local state
      setAccounts(accounts.map(a =>
        a.id === editingAccount.id
          ? {
              ...a,
              name: accountName,
              type: accountType.toLowerCase(),
              provider: financialProvider || null,
              logo: logo
            }
          : a
      ));

      setShowEditModal(false);
      setEditingAccount(null);
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Failed to update account");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-base-100">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
          <TopBar />
          <main className="p-8">
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar />

        <main className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Account Balances</h1>
            <p className="text-base-content/60 mt-2">
              Manage your linked accounts. Check accounts to include them in your Current Cash calculation.
            </p>
          </div>

          {accounts.length === 0 ? (
            <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10">
              <div className="card-body items-center text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-base-content/40 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">No accounts yet</h3>
                <p className="text-base-content/60 mb-4">Add your first bank account to start tracking your finances</p>
                <button
                  onClick={() => setShowAddAccountModal(true)}
                  className="btn btn-accent btn-lg gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add Bank Account
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 hover:shadow-lg transition-all"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {account.logo ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                              <Image
                                src={account.logo}
                                alt={account.name}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-base-content/10 flex items-center justify-center shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25v9c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125v-9H1z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm truncate">{account.name}</h3>
                            <p className="text-xs text-base-content/60">{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={account.is_active}
                          onChange={() => toggleAccount(account.id)}
                          className="checkbox checkbox-accent checkbox-sm shrink-0"
                        />
                      </div>

                      <div className="divider my-2"></div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-base-content/60">Balance</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-xs font-bold text-base-content/60">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={Number(account.balance).toFixed(2)}
                            onChange={(e) => {
                              const newBalance = parseFloat(e.target.value) || 0;
                              updateBalance(account.id, newBalance);
                            }}
                            className="input input-bordered input-sm w-24 text-right font-bold text-sm"
                          />
                        </div>
                      </div>

                      {!account.is_active && account.balance > 0 && (
                        <div className="alert alert-warning mt-2 py-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="text-[10px]">Not included</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 mt-3">
                        <button
                          onClick={() => handleEdit(account)}
                          className="btn btn-ghost btn-xs flex-1 gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                          <span className="text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10 gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Account Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowAddAccountModal(true)}
                  className="btn btn-accent btn-lg gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add Bank Account
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Edit Account Modal */}
      {showEditModal && editingAccount && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Edit Account</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAccount(null);
                }}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAccount} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Basic Information</h4>
                  <span className="badge badge-sm badge-ghost">Required</span>
                </div>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Account Name *</span>
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      defaultValue={editingAccount.name}
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
                    <select
                      name="financialProvider"
                      className="select select-bordered"
                      defaultValue={editingAccount.provider || ""}
                    >
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
                </div>
              </div>

              {/* Account Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Account Details</h4>
                  <span className="badge badge-sm badge-ghost">Required</span>
                </div>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Account Type *</span>
                    </label>
                    <select name="type" className="select select-bordered" defaultValue={editingAccount.type.charAt(0).toUpperCase() + editingAccount.type.slice(1)} required>
                      <option value="">Select account type...</option>
                      <option>Checking</option>
                      <option>Savings</option>
                      <option>Money Market</option>
                      <option>CD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAccount(null);
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
            setEditingAccount(null);
          }}></div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Add Bank Account</h3>
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <AddBankAccountForm
              onSuccess={(newAccount) => {
                setAccounts([...accounts, newAccount as Account]);
                setShowAddAccountModal(false);
              }}
              onCancel={() => setShowAddAccountModal(false)}
            />
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => setShowAddAccountModal(false)}></div>
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  return (
    <SidebarProvider>
      <AccountsPageContent />
    </SidebarProvider>
  );
}
