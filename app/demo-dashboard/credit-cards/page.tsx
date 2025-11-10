"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CompanyLogo from "@/components/dashboard/CompanyLogo";
import DemoBanner from "@/components/dashboard/DemoBanner";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";

interface CreditCard {
  id: string;
  name: string;
  brand: string;
  balance: number;
  dueDayOfMonth: number; // Changed from dueDate to dueDayOfMonth (1-31)
  is_active: boolean;
}

const SAMPLE_CREDIT_CARDS: CreditCard[] = [
  { id: "1", name: "Sapphire Reserve", brand: "chase", balance: 850.25, dueDayOfMonth: 20, is_active: true },
  { id: "2", name: "Gold Card", brand: "amex", balance: 425.50, dueDayOfMonth: 25, is_active: true },
  { id: "3", name: "Venture X", brand: "capitalone", balance: 0, dueDayOfMonth: 15, is_active: true },
];

function CreditCardsPageContent() {
  const { isPinned } = useSidebar();
  const [cards, setCards] = useState<CreditCard[]>(SAMPLE_CREDIT_CARDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const handleReset = () => {
    setCards(SAMPLE_CREDIT_CARDS);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate next due date based on day of month
  const getNextDueDate = (dayOfMonth: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Start with this month
    let nextDue = new Date(currentYear, currentMonth, dayOfMonth);

    // If the day has already passed this month, move to next month
    if (currentDay > dayOfMonth) {
      nextDue = new Date(currentYear, currentMonth + 1, dayOfMonth);
    }

    return nextDue;
  };

  // Format due date with smart labels
  const formatDueDate = (dayOfMonth: number) => {
    const today = new Date();
    const nextDue = getNextDueDate(dayOfMonth);
    const daysUntilDue = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue === 0) {
      return { text: "Today", color: "text-error", bgColor: "bg-error/10" };
    } else if (daysUntilDue === 1) {
      return { text: "Tomorrow", color: "text-warning", bgColor: "bg-warning/10" };
    } else if (daysUntilDue === 2) {
      return { text: "In 2 days", color: "text-warning", bgColor: "bg-warning/10" };
    } else if (daysUntilDue === 3) {
      return { text: "In 3 days", color: "text-warning", bgColor: "bg-warning/10" };
    } else {
      // More than 3 days away - show normal date
      return {
        text: nextDue.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        color: "text-base-content",
        bgColor: "bg-base-200"
      };
    }
  };

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newCard: CreditCard = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      balance: parseFloat(formData.get("balance") as string),
      dueDayOfMonth: parseInt(formData.get("dueDayOfMonth") as string),
      is_active: true,
    };

    setCards([...cards, newCard]);
    setShowAddModal(false);
    form.reset();
  };

  const handleEditCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCard) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedCard: CreditCard = {
      ...editingCard,
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      balance: parseFloat(formData.get("balance") as string),
      dueDayOfMonth: parseInt(formData.get("dueDayOfMonth") as string),
    };

    setCards(cards.map((c) => (c.id === editingCard.id ? updatedCard : c)));
    setShowEditModal(false);
    setEditingCard(null);
  };

  const openEditModal = (card: CreditCard) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingCardId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteCard = () => {
    if (deletingCardId) {
      setCards(cards.filter((c) => c.id !== deletingCardId));
      setDeletingCardId(null);
      setShowDeleteModal(false);
    }
  };

  // Calculate summary statistics
  const totalBalance = cards.filter(c => c.is_active).reduce((sum, c) => sum + c.balance, 0);
  const activeCards = cards.filter(c => c.is_active).length;

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar onReset={handleReset} />

        <div className="p-3 sm:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Credit Cards</h1>
              <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                Manage your credit card accounts and track balances
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-accent btn-sm sm:btn-md gap-2 w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span className="hidden sm:inline">Add Credit Card</span>
              <span className="sm:hidden">Add Card</span>
            </button>
          </div>

          {/* Demo Banner */}
          <DemoBanner />

          {/* Summary Stats - Removed Average Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-8">
            <div className="card bg-warning/10 border border-warning/20">
              <div className="card-body p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs font-semibold text-warning/70 uppercase tracking-wider">Total Balance Owed</div>
                <div className="text-xl sm:text-2xl font-bold text-warning">
                  {formatCurrency(totalBalance)}
                </div>
                <div className="text-[10px] sm:text-xs text-base-content/60 mt-1">
                  Across {activeCards} active card{activeCards !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="card bg-primary/10 border border-primary/20">
              <div className="card-body p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs font-semibold text-primary/70 uppercase tracking-wider">Active Cards</div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {activeCards}
                </div>
                <div className="text-[10px] sm:text-xs text-base-content/60 mt-1">
                  Out of {cards.length} total
                </div>
              </div>
            </div>
          </div>

          {/* Credit Cards Table - Removed Status Column */}
          <div className="card bg-base-100 border border-base-content/10 shadow-lg">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Card Name</th>
                    <th>Brand</th>
                    <th>Balance</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => {
                    const dueDate = formatDueDate(card.dueDayOfMonth);
                    return (
                      <tr key={card.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <CompanyLogo
                              name={card.brand}
                              size={40}
                              fallbackIcon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5 text-warning"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              }
                            />
                            <div>
                              <div className="font-semibold">{card.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-ghost badge-sm capitalize">
                            {card.brand}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="font-semibold text-warning">
                            {formatCurrency(card.balance)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-sm ${dueDate.bgColor} ${dueDate.color} font-medium`}>
                            {dueDate.text}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(card)}
                              className="btn btn-ghost btn-xs"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(card.id)}
                              className="btn btn-ghost btn-xs text-error"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden p-2 space-y-3">
              {cards.length === 0 ? (
                <div className="text-center py-8 text-base-content/60 text-sm">
                  No credit cards yet
                </div>
              ) : (
                cards.map((card) => {
                  const dueDate = formatDueDate(card.dueDayOfMonth);
                  return (
                    <div key={card.id} className="card bg-base-100/50 border border-base-content/10">
                      <div className="card-body p-3">
                        {/* Header with card name and actions */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <CompanyLogo
                              name={card.brand}
                              size={32}
                              fallbackIcon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-4 h-4 text-warning"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              }
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm truncate">{card.name}</p>
                              <span className="badge badge-ghost badge-xs capitalize">{card.brand}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => openEditModal(card)}
                              className="btn btn-ghost btn-xs"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(card.id)}
                              className="btn btn-ghost btn-xs text-error"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Balance and Due Date */}
                        <div className="space-y-2 pt-2 border-t border-base-content/10">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-base-content/60">Current Balance</span>
                            <span className="font-bold text-warning">{formatCurrency(card.balance)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-base-content/60">Next Due</span>
                            <span className={`badge badge-sm ${dueDate.bgColor} ${dueDate.color} font-medium`}>
                              {dueDate.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Add Credit Card Modal */}
        {showAddModal && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Add Credit Card</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddCard}>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Card Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Sapphire Reserve"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Card Brand</span>
                      </label>
                      <select name="brand" className="select select-bordered w-full" required>
                        <option value="">Select brand...</option>
                        <option value="chase">Chase</option>
                        <option value="amex">American Express</option>
                        <option value="capitalone">Capital One</option>
                        <option value="discover">Discover</option>
                        <option value="citi">Citi</option>
                        <option value="wellsfargo">Wells Fargo</option>
                        <option value="bankofamerica">Bank of America</option>
                        <option value="usbank">U.S. Bank</option>
                        <option value="barclays">Barclays</option>
                        <option value="synchrony">Synchrony</option>
                        <option value="pnc">PNC Bank</option>
                        <option value="td">TD Bank</option>
                        <option value="navyfederal">Navy Federal</option>
                        <option value="usaa">USAA</option>
                        <option value="regions">Regions Bank</option>
                        <option value="citizens">Citizens Bank</option>
                        <option value="marcus">Marcus (Goldman Sachs)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Current Balance</span>
                      </label>
                      <input
                        type="number"
                        name="balance"
                        placeholder="0.00"
                        step="0.01"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Due Day of Month</span>
                      <span className="label-text-alt">1-31</span>
                    </label>
                    <input
                      type="number"
                      name="dueDayOfMonth"
                      placeholder="e.g., 15"
                      min="1"
                      max="31"
                      className="input input-bordered w-full"
                      required
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Enter the day of the month your payment is due
                      </span>
                    </label>
                  </div>
                </div>
                <div className="modal-action">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Add Credit Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Credit Card Modal */}
        {showEditModal && editingCard && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Edit Credit Card</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCard(null);
                  }}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditCard}>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Card Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingCard.name}
                      placeholder="e.g., Sapphire Reserve"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Card Brand</span>
                      </label>
                      <select name="brand" defaultValue={editingCard.brand} className="select select-bordered w-full" required>
                        <option value="chase">Chase</option>
                        <option value="amex">American Express</option>
                        <option value="capitalone">Capital One</option>
                        <option value="discover">Discover</option>
                        <option value="citi">Citi</option>
                        <option value="wellsfargo">Wells Fargo</option>
                        <option value="bankofamerica">Bank of America</option>
                        <option value="usbank">U.S. Bank</option>
                        <option value="barclays">Barclays</option>
                        <option value="synchrony">Synchrony</option>
                        <option value="pnc">PNC Bank</option>
                        <option value="td">TD Bank</option>
                        <option value="navyfederal">Navy Federal</option>
                        <option value="usaa">USAA</option>
                        <option value="regions">Regions Bank</option>
                        <option value="citizens">Citizens Bank</option>
                        <option value="marcus">Marcus (Goldman Sachs)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Current Balance</span>
                      </label>
                      <input
                        type="number"
                        name="balance"
                        defaultValue={editingCard.balance}
                        placeholder="0.00"
                        step="0.01"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Due Day of Month</span>
                      <span className="label-text-alt">1-31</span>
                    </label>
                    <input
                      type="number"
                      name="dueDayOfMonth"
                      defaultValue={editingCard.dueDayOfMonth}
                      placeholder="e.g., 15"
                      min="1"
                      max="31"
                      className="input input-bordered w-full"
                      required
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Enter the day of the month your payment is due
                      </span>
                    </label>
                  </div>
                </div>
                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCard(null);
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
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-md">
              <h3 className="font-bold text-lg">Delete Credit Card</h3>
              <p className="py-4">Are you sure you want to delete this credit card? This action cannot be undone.</p>
              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingCardId(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button onClick={handleDeleteCard} className="btn btn-error">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreditCardsPage() {
  return (
    <SidebarProvider>
      <CreditCardsPageContent />
    </SidebarProvider>
  );
}
