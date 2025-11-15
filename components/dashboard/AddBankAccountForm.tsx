"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";

interface BankInstitution {
  name: string;
  domain: string;
}

interface AddBankAccountFormProps {
  onSuccess: (account: {
    id: string;
    name: string;
    type: string;
    balance: number;
    provider: string | null;
    logo: string | null;
    is_active: boolean;
  }) => void;
  onCancel: () => void;
}

const AddBankAccountForm: React.FC<AddBankAccountFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [bankInstitutions, setBankInstitutions] = useState<BankInstitution[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBankInstitutions();
  }, []);

  const fetchBankInstitutions = async () => {
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const accountName = formData.get("accountName") as string;
    const financialProvider = formData.get("financialProvider") as string;
    const accountType = formData.get("type") as string;
    const balance = parseFloat(formData.get("balance") as string) || 0;

    const selectedBank = financialProvider
      ? bankInstitutions.find((b) => b.name === financialProvider)
      : null;

    const logo =
      selectedBank?.domain && selectedBank.domain !== "generic"
        ? `https://img.logo.dev/${selectedBank.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`
        : null;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to add an account");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("bank_accounts")
        .insert({
          user_id: user.id,
          name: accountName,
          type: accountType.toLowerCase(),
          balance: balance,
          provider: financialProvider || null,
          logo: logo,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Failed to add account");
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
            <span className="label-text font-medium">Account Name *</span>
          </label>
          <input
            type="text"
            name="accountName"
            placeholder="e.g., My Checking Account, Emergency Savings"
            className="input input-bordered w-full"
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
          </label>
          <select
            name="financialProvider"
            className="select select-bordered w-full"
            defaultValue=""
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

      {/* Account Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">Account Details</h4>
          <span className="badge badge-sm badge-ghost">Required</span>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Account Type *</span>
          </label>
          <select
            name="type"
            className="select select-bordered w-full"
            defaultValue=""
            required
          >
            <option value="">Select account type...</option>
            <option value="Checking">Checking</option>
            <option value="Savings">Savings</option>
            <option value="Money Market">Money Market</option>
            <option value="CD">CD</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Initial Balance *</span>
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
              Enter the current balance of this account
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Add Account"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddBankAccountForm;
