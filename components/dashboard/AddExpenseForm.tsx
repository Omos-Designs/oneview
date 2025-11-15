"use client";

import React, { useState } from "react";
import { createClient } from "@/libs/supabase/client";

interface AddExpenseFormProps {
  onSuccess: (expense: {
    id: string;
    name: string;
    amount: number;
    due_date: string;
    category: string;
    type: "expense";
    logo: string | null;
  }) => void;
  onCancel: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const amount = parseFloat(formData.get("amount") as string) || 0;
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

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to add an expense");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          name,
          amount,
          due_date: dateString,
          category,
          type: "expense",
          logo: null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense");
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
            <span className="label-text font-medium">Expense Name *</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Rent, Electric Bill, Phone Bill"
            className="input input-bordered w-full"
            required
          />
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Give your expense a descriptive name
            </span>
          </label>
        </div>

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
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Transportation">Transportation</option>
            <option value="Insurance">Insurance</option>
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
                className="input input-bordered w-full pl-7"
                required
              />
            </div>
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Amount due each month
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Due Date *</span>
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
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Day of month (1-31)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-accent"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Add Expense"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
