import { SupabaseClient } from "@supabase/supabase-js";

export type IncomeSource = {
  id: string;
  user_id: string;
  source: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly" | "yearly";
  next_date: string | null;
  category: string;
  auto_detected: boolean;
  last_received_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Fetches all income sources for a user
 */
export async function getIncomeSources(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("income_sources")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as IncomeSource[];
}

/**
 * Fetches upcoming income (next 30 days)
 */
export async function getUpcomingIncome(supabase: SupabaseClient, userId: string) {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const endDate = thirtyDaysFromNow.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("income_sources")
    .select("*")
    .eq("user_id", userId)
    .gte("next_date", today)
    .lte("next_date", endDate)
    .order("next_date", { ascending: true });

  if (error) throw error;
  return data as IncomeSource[];
}

/**
 * Creates a new income source
 */
export async function createIncomeSource(
  supabase: SupabaseClient,
  userId: string,
  income: {
    source: string;
    amount: number;
    frequency: "weekly" | "biweekly" | "monthly" | "yearly";
    next_date?: string;
    category?: string;
  }
) {
  const { data, error } = await supabase
    .from("income_sources")
    .insert({
      user_id: userId,
      ...income,
      category: income.category || "Other",
    })
    .select()
    .single();

  if (error) throw error;
  return data as IncomeSource;
}

/**
 * Updates an income source
 */
export async function updateIncomeSource(
  supabase: SupabaseClient,
  incomeId: string,
  updates: {
    source?: string;
    amount?: number;
    frequency?: "weekly" | "biweekly" | "monthly" | "yearly";
    next_date?: string;
    category?: string;
    last_received_at?: string;
  }
) {
  const { data, error } = await supabase
    .from("income_sources")
    .update(updates)
    .eq("id", incomeId)
    .select()
    .single();

  if (error) throw error;
  return data as IncomeSource;
}

/**
 * Marks income as received and updates next_date based on frequency
 */
export async function markIncomeReceived(
  supabase: SupabaseClient,
  incomeId: string,
  frequency: "weekly" | "biweekly" | "monthly" | "yearly"
) {
  const now = new Date();
  const nextDate = new Date();

  // Calculate next date based on frequency
  switch (frequency) {
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "biweekly":
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return updateIncomeSource(supabase, incomeId, {
    last_received_at: now.toISOString(),
    next_date: nextDate.toISOString().split("T")[0],
  });
}

/**
 * Deletes an income source
 */
export async function deleteIncomeSource(supabase: SupabaseClient, incomeId: string) {
  const { error } = await supabase.from("income_sources").delete().eq("id", incomeId);

  if (error) throw error;
}

/**
 * Calculates total monthly income (converts all frequencies to monthly)
 */
export async function calculateMonthlyIncome(supabase: SupabaseClient, userId: string) {
  const sources = await getIncomeSources(supabase, userId);

  const frequencyMultipliers = {
    weekly: 52 / 12,
    biweekly: 26 / 12,
    monthly: 1,
    yearly: 1 / 12,
  };

  return sources.reduce((total, source) => {
    const multiplier = frequencyMultipliers[source.frequency];
    return total + Number(source.amount) * multiplier;
  }, 0);
}
