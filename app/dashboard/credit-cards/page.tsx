"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CompanyLogo from "@/components/dashboard/CompanyLogo";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import { createClient } from "@/libs/supabase/client";

interface CreditCard {
  id: string;
  name: string;
  balance: number;
  due_date: number; // Day of month (1-31)
  logo: string | null;
  is_active: boolean;
  user_id: string;
  created_at: string;
}

function CreditCardsPageContent() {
  const { isPinned } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  // Credit card autocomplete state
  const [cardInput, setCardInput] = useState("");
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [selectedCardLogo, setSelectedCardLogo] = useState<string | null>(null);

  // Popular credit cards with Logo.dev domains
  const popularCreditCards = [
    // Chase
    { name: "Chase Sapphire Preferred", domain: "chase.com" },
    { name: "Chase Sapphire Reserve", domain: "chase.com" },
    { name: "Chase Freedom Unlimited", domain: "chase.com" },
    { name: "Chase Freedom Flex", domain: "chase.com" },
    // American Express
    { name: "American Express Platinum", domain: "americanexpress.com" },
    { name: "American Express Gold", domain: "americanexpress.com" },
    { name: "American Express Blue Cash Preferred", domain: "americanexpress.com" },
    { name: "American Express Blue Cash Everyday", domain: "americanexpress.com" },
    // Capital One
    { name: "Capital One Venture", domain: "capitalone.com" },
    { name: "Capital One Venture X", domain: "capitalone.com" },
    { name: "Capital One Quicksilver", domain: "capitalone.com" },
    { name: "Capital One Savor", domain: "capitalone.com" },
    // Citi
    { name: "Citi Double Cash", domain: "citi.com" },
    { name: "Citi Premier", domain: "citi.com" },
    { name: "Citi Custom Cash", domain: "citi.com" },
    // Discover
    { name: "Discover it Cash Back", domain: "discover.com" },
    { name: "Discover it Miles", domain: "discover.com" },
    // Bank of America
    { name: "Bank of America Travel Rewards", domain: "bankofamerica.com" },
    { name: "Bank of America Customized Cash Rewards", domain: "bankofamerica.com" },
    // Wells Fargo
    { name: "Wells Fargo Active Cash", domain: "wellsfargo.com" },
    { name: "Wells Fargo Autograph", domain: "wellsfargo.com" },
    // Others
    { name: "Apple Card", domain: "apple.com" },
    { name: "US Bank Altitude Reserve", domain: "usbank.com" },
    { name: "Barclays Arrival Plus", domain: "barclays.com" },
    { name: "PNC Cash Rewards", domain: "pnc.com" },
    { name: "Navy Federal More Rewards", domain: "navyfederal.org" },
    { name: "USAA Cashback Rewards Plus", domain: "usaa.com" },
  ];

  useEffect(() => {
    fetchCreditCards();
  }, []);

  async function fetchCreditCards() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch credit cards
      const { data: cardsData, error } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setCards(cardsData || []);
    } catch (error) {
      console.error("Error fetching credit cards:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter credit cards based on input
  const getFilteredCards = () => {
    if (!cardInput.trim()) return popularCreditCards;
    const query = cardInput.toLowerCase();
    return popularCreditCards.filter(card =>
      card.name.toLowerCase().includes(query)
    );
  };

  // Handle credit card selection from dropdown
  const handleCardSelect = (card: typeof popularCreditCards[0]) => {
    setCardInput(card.name);
    if (card.domain) {
      const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY || "";
      setSelectedCardLogo(`https://img.logo.dev/${card.domain}?token=${LOGO_DEV_KEY}`);
    } else {
      setSelectedCardLogo(null);
    }
    setShowCardDropdown(false);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  // Format due date to show next occurrence (month + day)
  const formatDueDate = (dueDay: number): string => {
    const today = new Date();
    const currentDay = today.getDate();
    let targetYear = today.getFullYear();
    let targetMonth = today.getMonth(); // 0-11

    // If the due date already passed this month, use next month
    if (dueDay < currentDay) {
      targetMonth++;
      // Handle year rollover
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear++;
      }
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[targetMonth]} ${dueDay}`;
  };

  const handleAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use cardInput for the name and selectedCardLogo for the logo
      const logo = selectedCardLogo;

      const { error } = await supabase.from("credit_cards").insert({
        user_id: user.id,
        name: cardInput,
        balance: parseFloat(formData.get("balance") as string),
        due_date: parseInt(formData.get("dueDate") as string, 10),
        is_active: true,
        logo,
      });

      if (error) throw error;

      setShowAddModal(false);
      form.reset();
      setCardInput("");
      setSelectedCardLogo(null);
      setShowCardDropdown(false);
      fetchCreditCards();
    } catch (error) {
      console.error("Error adding credit card:", error);
      alert("Failed to add credit card. Please try again.");
    }
  };

  const handleEditCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCard) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("credit_cards")
        .update({
          name: formData.get("name") as string,
          balance: parseFloat(formData.get("balance") as string),
          due_date: parseInt(formData.get("dueDate") as string, 10),
        })
        .eq("id", editingCard.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingCard(null);
      fetchCreditCards();
    } catch (error) {
      console.error("Error updating credit card:", error);
      alert("Failed to update credit card. Please try again.");
    }
  };

  const openEditModal = (card: CreditCard) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingCardId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteCard = async () => {
    if (!deletingCardId) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("credit_cards")
        .delete()
        .eq("id", deletingCardId);

      if (error) throw error;

      setDeletingCardId(null);
      setShowDeleteModal(false);
      fetchCreditCards();
    } catch (error) {
      console.error("Error deleting credit card:", error);
      alert("Failed to delete credit card. Please try again.");
    }
  };

  // Calculate summary statistics
  const totalBalance = cards.filter(c => c.is_active).reduce((sum, c) => sum + c.balance, 0);
  const activeCards = cards.filter(c => c.is_active).length;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-base-100">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
          <TopBar />
          <div className="p-3 sm:p-6 max-w-7xl mx-auto">
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

          {/* Summary Stats */}
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

          {/* Credit Cards Table */}
          <div className="card bg-base-100 border border-base-content/10 shadow-lg">
            {cards.length === 0 ? (
              <div className="p-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-16 h-16 mx-auto mb-4 text-base-content/40"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-2">No credit cards yet</h3>
                <p className="text-base-content/60 mb-4">Add your first credit card to start tracking</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-accent btn-lg gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add Your First Card
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Card Name</th>
                        <th>Balance</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cards.map((card) => {
                        return (
                          <tr key={card.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                {card.logo ? (
                                  <img
                                    src={card.logo}
                                    alt={card.name}
                                    className="w-10 h-10 rounded-lg object-contain"
                                    onError={(e) => {
                                      // Hide image and show fallback icon if image fails to load
                                      const img = e.currentTarget;
                                      img.style.display = 'none';
                                      const fallback = img.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
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
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold">{card.name}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="font-semibold text-warning">
                                {formatCurrency(card.balance)}
                              </div>
                            </td>
                            <td>
                              <span className="text-sm font-medium">
                                {formatDueDate(card.due_date)}
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
                  {cards.map((card) => {
                    return (
                      <div key={card.id} className="card bg-base-100/50 border border-base-content/10">
                        <div className="card-body p-3">
                          {/* Header with card name and actions */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {card.logo ? (
                                <img
                                  src={card.logo}
                                  alt={card.name}
                                  className="w-8 h-8 rounded-lg object-contain"
                                  onError={(e) => {
                                    // Hide image and show fallback icon if image fails to load
                                    const img = e.currentTarget;
                                    img.style.display = 'none';
                                    const fallback = img.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
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
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm truncate">{card.name}</p>
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
                              <span className="text-xs text-base-content/60">Payment Due</span>
                              <span className="text-sm font-medium">{formatDueDate(card.due_date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
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
                      <span className="label-text">Credit Card Name</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardInput}
                        onChange={(e) => {
                          setCardInput(e.target.value);
                          setShowCardDropdown(true);
                          setSelectedCardLogo(null);
                        }}
                        onFocus={() => setShowCardDropdown(true)}
                        onBlur={() => {
                          // Delay to allow clicking dropdown items
                          setTimeout(() => setShowCardDropdown(false), 200);
                        }}
                        placeholder="Type to search cards or enter custom..."
                        className="input input-bordered w-full"
                        required
                      />
                      {/* Autocomplete dropdown */}
                      {showCardDropdown && cardInput && (
                        <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-content/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {getFilteredCards().length > 0 ? (
                            <>
                              {getFilteredCards().map((card) => (
                                <button
                                  key={card.name}
                                  type="button"
                                  onClick={() => handleCardSelect(card)}
                                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-base-content/10 transition-colors text-left"
                                >
                                  {card.domain && (
                                    <img
                                      src={`https://img.logo.dev/${card.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY || ""}`}
                                      alt={card.name}
                                      width={20}
                                      height={20}
                                      className="rounded"
                                    />
                                  )}
                                  <span className="font-medium">{card.name}</span>
                                </button>
                              ))}
                              {/* Custom option */}
                              {!popularCreditCards.find(c => c.name.toLowerCase() === cardInput.toLowerCase()) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowCardDropdown(false);
                                    setSelectedCardLogo(null);
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
                                    <div className="font-medium">Use &ldquo;{cardInput}&rdquo;</div>
                                    <div className="text-xs text-base-content/60">Add as custom card</div>
                                  </div>
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setShowCardDropdown(false);
                                setSelectedCardLogo(null);
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
                                <div className="font-medium">Use &ldquo;{cardInput}&rdquo;</div>
                                <div className="text-xs text-base-content/60">Add as custom card</div>
                              </div>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Due Date</span>
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
                      placeholder="e.g., Chase Sapphire Reserve, Amex Platinum"
                      className="input input-bordered w-full"
                      required
                    />
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
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Due Date</span>
                      <span className="label-text-alt text-base-content/60">Day of month</span>
                    </label>
                    <input
                      type="number"
                      name="dueDate"
                      defaultValue={editingCard.due_date}
                      min="1"
                      max="31"
                      placeholder="1-31"
                      className="input input-bordered w-full"
                      required
                    />
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
