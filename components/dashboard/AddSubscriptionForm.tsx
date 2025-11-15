"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";

interface SubscriptionService {
  name: string;
  domain: string | null;
}

interface AddSubscriptionFormProps {
  onSuccess: (subscription: {
    id: string;
    name: string;
    amount: number;
    due_date: string;
    category: string;
    type: "subscription";
    logo: string | null;
  }) => void;
  onCancel: () => void;
}

const AddSubscriptionForm: React.FC<AddSubscriptionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [subscriptionServices, setSubscriptionServices] = useState<SubscriptionService[]>([]);
  const [subscriptionInput, setSubscriptionInput] = useState("");
  const [showSubscriptionDropdown, setShowSubscriptionDropdown] = useState(false);
  const [selectedSubscriptionLogo, setSelectedSubscriptionLogo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSubscriptionServices();
  }, []);

  const fetchSubscriptionServices = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscription_services")
        .select("name, domain")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching subscription services:", error);
        return;
      }

      if (data) {
        setSubscriptionServices(data);
      }
    } catch (error) {
      console.error("Error fetching subscription services:", error);
    }
  };

  const getFilteredServices = () => {
    if (!subscriptionInput.trim()) return subscriptionServices;
    const query = subscriptionInput.toLowerCase();
    return subscriptionServices.filter((service) =>
      service.name.toLowerCase().includes(query)
    );
  };

  const handleSubscriptionSelect = (service: SubscriptionService) => {
    setSubscriptionInput(service.name);
    if (service.domain) {
      const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY || "";
      setSelectedSubscriptionLogo(
        `https://img.logo.dev/${service.domain}?token=${LOGO_DEV_KEY}`
      );
    } else {
      setSelectedSubscriptionLogo(null);
    }
    setShowSubscriptionDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
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
        alert("You must be logged in to add a subscription");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          name: subscriptionInput,
          amount,
          due_date: dateString,
          category,
          type: "subscription",
          logo: selectedSubscriptionLogo,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert("Failed to add subscription");
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
            <span className="label-text font-medium">Service Name *</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={subscriptionInput}
              onChange={(e) => {
                setSubscriptionInput(e.target.value);
                setShowSubscriptionDropdown(true);
                setSelectedSubscriptionLogo(null);
              }}
              onFocus={() => setShowSubscriptionDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowSubscriptionDropdown(false), 200);
              }}
              placeholder="Type to search services or enter custom..."
              className="input input-bordered w-full"
              required
            />
            {showSubscriptionDropdown && subscriptionInput && (
              <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-content/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {getFilteredServices().length > 0 ? (
                  <>
                    {getFilteredServices().map((service) => (
                      <button
                        key={service.name}
                        type="button"
                        onClick={() => handleSubscriptionSelect(service)}
                        className="flex items-center gap-3 w-full px-4 py-2 hover:bg-base-content/10 transition-colors text-left"
                      >
                        {service.domain && (
                          <img
                            src={`https://img.logo.dev/${service.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY || ""}`}
                            alt={service.name}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                        )}
                        <span className="font-medium">{service.name}</span>
                      </button>
                    ))}
                    {!subscriptionServices.find(
                      (s) => s.name.toLowerCase() === subscriptionInput.toLowerCase()
                    ) && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSubscriptionDropdown(false);
                          setSelectedSubscriptionLogo(null);
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
                            Use &ldquo;{subscriptionInput}&rdquo;
                          </div>
                          <div className="text-xs text-base-content/60">
                            Add as custom subscription
                          </div>
                        </div>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubscriptionDropdown(false);
                      setSelectedSubscriptionLogo(null);
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
                        Use &ldquo;{subscriptionInput}&rdquo;
                      </div>
                      <div className="text-xs text-base-content/60">
                        Add as custom subscription
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Select a service to show their logo
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
            <option value="Entertainment">Entertainment</option>
            <option value="Software">Software</option>
            <option value="Media">Media</option>
            <option value="Fitness">Fitness</option>
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
                Monthly subscription cost
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Billing Date *</span>
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
          disabled={isSubmitting || !subscriptionInput}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Add Subscription"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddSubscriptionForm;
