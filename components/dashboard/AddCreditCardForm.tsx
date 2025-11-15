"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";

interface CreditCardBrand {
  name: string;
  domain: string;
}

interface AddCreditCardFormProps {
  onSuccess: (card: {
    id: string;
    name: string;
    balance: number;
    due_date: string;
    logo: string | null;
    is_active: boolean;
  }) => void;
  onCancel: () => void;
}

const AddCreditCardForm: React.FC<AddCreditCardFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [creditCardBrands, setCreditCardBrands] = useState<CreditCardBrand[]>([]);
  const [cardInput, setCardInput] = useState("");
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [selectedCardLogo, setSelectedCardLogo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCreditCardBrands();
  }, []);

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

  const getFilteredCards = () => {
    if (!cardInput.trim()) return creditCardBrands;
    const query = cardInput.toLowerCase();
    return creditCardBrands.filter((card) =>
      card.name.toLowerCase().includes(query)
    );
  };

  const handleCardSelect = (card: CreditCardBrand) => {
    setCardInput(card.name);
    const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY || "";
    setSelectedCardLogo(
      `https://img.logo.dev/${card.domain}?token=${LOGO_DEV_KEY}`
    );
    setShowCardDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const balance = parseFloat(formData.get("balance") as string) || 0;
    const dueDate = formData.get("dueDate") as string;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to add a credit card");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("credit_cards")
        .insert({
          user_id: user.id,
          name: cardInput,
          balance,
          due_date: dueDate,
          logo: selectedCardLogo,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Error adding credit card:", error);
      alert("Failed to add credit card");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">Basic Information</h4>
          <span className="badge badge-sm badge-ghost">Required</span>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Credit Card Name *</span>
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
                setTimeout(() => setShowCardDropdown(false), 200);
              }}
              placeholder="Type to search cards or enter custom..."
              className="input input-bordered w-full"
              required
            />
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
                    {!creditCardBrands.find(
                      (c) => c.name.toLowerCase() === cardInput.toLowerCase()
                    ) && (
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
                          <div className="font-medium">
                            Use &ldquo;{cardInput}&rdquo;
                          </div>
                          <div className="text-xs text-base-content/60">
                            Add as custom card
                          </div>
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
                      <div className="font-medium">
                        Use &ldquo;{cardInput}&rdquo;
                      </div>
                      <div className="text-xs text-base-content/60">
                        Add as custom card
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Select a card provider to show their logo
            </span>
          </label>
        </div>
      </div>

      {/* Balance Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">Balance Details</h4>
          <span className="badge badge-sm badge-ghost">Required</span>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Current Balance *</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 font-medium">
              $
            </span>
            <input
              type="number"
              name="balance"
              step="0.01"
              placeholder="0.00"
              className="input input-bordered w-full pl-7"
              required
            />
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Enter the current outstanding balance on this card
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Payment Due Date *</span>
          </label>
          <input
            type="text"
            name="dueDate"
            placeholder="e.g., 15th of each month"
            className="input input-bordered w-full"
            required
          />
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              When is your payment due each month?
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-accent"
          disabled={isSubmitting || !cardInput}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Add Credit Card"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddCreditCardForm;
