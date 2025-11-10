"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import DemoBanner from "@/components/dashboard/DemoBanner";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import Image from "next/image";

function AccountsPageContent() {
  const { isPinned } = useSidebar();
  const defaultAccounts = [
    { id: 1, name: "Chase Checking", balance: 3420.50, type: "Checking", active: true, provider: "Chase", logo: `https://img.logo.dev/chase.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
    { id: 2, name: "Ally Savings", balance: 2000.00, type: "Savings", active: true, provider: "Ally Bank", logo: `https://img.logo.dev/ally.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}` },
  ];

  const [accounts, setAccounts] = useState(defaultAccounts);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Bank institutions list for the edit form
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

  // Load accounts from localStorage on mount, initialize with defaults if empty
  useEffect(() => {
    const storedAccounts = localStorage.getItem("accounts");
    if (storedAccounts) {
      const parsedAccounts = JSON.parse(storedAccounts);

      // Migrate old Clearbit URLs to Logo.dev
      const migratedAccounts = parsedAccounts.map((account: any) => {
        if (account.logo && account.logo.includes('logo.clearbit.com')) {
          // Extract domain from old Clearbit URL
          const domain = account.logo.replace('https://logo.clearbit.com/', '');
          // Update to Logo.dev URL
          return {
            ...account,
            logo: `https://img.logo.dev/${domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`
          };
        }
        return account;
      });

      // Save migrated data back to localStorage
      if (JSON.stringify(parsedAccounts) !== JSON.stringify(migratedAccounts)) {
        localStorage.setItem("accounts", JSON.stringify(migratedAccounts));
      }

      setAccounts(migratedAccounts.length > 0 ? migratedAccounts : defaultAccounts);
    } else {
      // Initialize localStorage with default accounts on first visit
      localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
    }
  }, []);

  const toggleAccount = (id: number) => {
    const updatedAccounts = accounts.map(acc =>
      acc.id === id ? { ...acc, active: !acc.active } : acc
    );
    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
  };

  const updateBalance = (id: number, newBalance: number) => {
    const updatedAccounts = accounts.map(a =>
      a.id === id ? { ...a, balance: newBalance } : a
    );
    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      const updatedAccounts = accounts.filter(a => a.id !== id);
      setAccounts(updatedAccounts);
      localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    }
  };

  const handleUpdateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const accountName = formData.get("accountName") as string;
    const financialProvider = formData.get("financialProvider") as string;
    const accountType = formData.get("type") as string;

    const selectedBank = financialProvider
      ? bankInstitutions.find(b => b.name === financialProvider)
      : null;

    const updatedAccounts = accounts.map(a =>
      a.id === editingAccount.id
        ? {
            ...a,
            name: accountName,
            type: accountType,
            provider: financialProvider || null, // Save the provider name
            logo: selectedBank?.domain && selectedBank.domain !== "generic"
              ? `https://img.logo.dev/${selectedBank.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`
              : null
          }
        : a
    );

    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    setShowEditModal(false);
    setEditingAccount(null);
  };

  const handleReset = () => {
    setAccounts(defaultAccounts);
    localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar onReset={handleReset} />

        <main className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/demo-dashboard" className="btn btn-ghost btn-sm">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Account Balances</h1>
            <p className="text-base-content/60 mt-2">
              Manage your linked accounts. Check accounts to include them in your Current Cash calculation.
            </p>
          </div>

          {/* Manual Mode Banner */}
          <DemoBanner />

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 hover:shadow-lg transition-all"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {account.logo ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
                          <Image
                            src={account.logo}
                            alt={account.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-base-content/10 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25v9c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125v-9H1z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{account.name}</h3>
                        <p className="text-sm text-base-content/60">{account.type}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={account.active}
                      onChange={() => toggleAccount(account.id)}
                      className="checkbox checkbox-accent checkbox-lg"
                    />
                  </div>

                  <div className="divider my-2"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/60">Balance</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-base-content/60">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={account.balance.toFixed(2)}
                        onChange={(e) => {
                          const newBalance = parseFloat(e.target.value) || 0;
                          updateBalance(account.id, newBalance);
                        }}
                        className="input input-bordered w-32 text-right font-bold"
                      />
                    </div>
                  </div>

                  {!account.active && account.balance > 0 && (
                    <div className="alert alert-warning mt-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs">Not included in Current Cash</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(account)}
                      className="btn btn-ghost btn-sm flex-1 gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Account Button */}
          <div className="mt-6">
            <Link href="/demo-dashboard/events/add?type=bank-account" className="btn btn-accent btn-lg gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Bank Account
            </Link>
          </div>
        </main>
      </div>

      {/* Edit Account Modal */}
      {showEditModal && editingAccount && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Edit Account</h3>

            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Account Name</span>
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Account Type</span>
                </label>
                <select name="type" className="select select-bordered" defaultValue={editingAccount.type} required>
                  <option value="">Select...</option>
                  <option>Checking</option>
                  <option>Savings</option>
                  <option>Money Market</option>
                  <option>CD</option>
                </select>
              </div>

              <div className="modal-action">
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
