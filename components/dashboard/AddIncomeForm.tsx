"use client";

import React, { useState } from "react";
import { createClient } from "@/libs/supabase/client";

interface AddIncomeFormProps {
  onSuccess: (income: {
    id: string;
    source: string;
    amount: number;
    frequency: "weekly" | "biweekly" | "monthly";
    category: string;
    amounts?: number[] | null;
  }) => void;
  onCancel: () => void;
}

const AddIncomeForm: React.FC<AddIncomeFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [paymentAmounts, setPaymentAmounts] = useState<number[]>([]);
  const [baseAmount, setBaseAmount] = useState<string>("");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const source = formData.get("source") as string;
    const category = formData.get("category") as string;
    const frequency = selectedFrequency as "weekly" | "biweekly" | "monthly";

    // Get the amount based on frequency
    let amount: number;
    if (frequency === "weekly" || frequency === "biweekly") {
      amount = paymentAmounts[0] || 0;
    } else {
      amount = parseFloat(baseAmount) || 0;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to add an income source");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("income_sources")
        .insert({
          user_id: user.id,
          source,
          amount,
          frequency,
          category,
          amounts: (frequency === "weekly" || frequency === "biweekly") && paymentAmounts.length > 0 ? paymentAmounts : null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income source");
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
            <span className="label-text font-medium">Income Source Name *</span>
          </label>
          <input
            type="text"
            name="source"
            placeholder="e.g., Salary - Tech Corp, Freelance - Web Design"
            className="input input-bordered w-full"
            required
          />
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Give your income source a descriptive name
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category *</span>
            </label>
            <select
              name="category"
              className="select select-bordered w-full"
              defaultValue=""
              required
            >
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

      {/* Payment Amounts Section - Only show after frequency is selected */}
      {selectedFrequency && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Payment Amounts</h4>
            <span className="badge badge-sm badge-ghost">Required</span>
          </div>

          {/* Monthly Payment */}
          {selectedFrequency === "monthly" && (
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
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="input input-bordered w-full pl-7"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  required
                />
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Enter your monthly payment amount
                </span>
              </label>
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
                  <div className="text-xs">
                    You&apos;ll receive 2 paychecks per month. Enter the amount for each paycheck below.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((index) => (
                  <div key={index} className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        {index === 0 ? "1st" : "2nd"} Paycheck Amount *
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={paymentAmounts[index] || ""}
                        onChange={(e) => handlePaymentAmountChange(index, e.target.value)}
                        className="input input-bordered w-full pl-7"
                        placeholder="0.00"
                        required
                      />
                    </div>
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
                  <div className="text-xs">
                    You&apos;ll receive 4 paychecks per month. Enter the amount for each week below.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Week {index + 1} Amount *</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={paymentAmounts[index] || ""}
                        onChange={(e) => handlePaymentAmountChange(index, e.target.value)}
                        className="input input-bordered w-full pl-7"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-accent"
          disabled={isSubmitting || !selectedFrequency}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Add Income Source"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddIncomeForm;
