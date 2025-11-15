import { SupabaseClient } from "@supabase/supabase-js";

export type Expense = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: number; // Day of month (1-31)
  category: string;
  type: "expense" | "subscription";
  logo: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Fetches all expenses for a user
 */
export async function getExpenses(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

/**
 * Fetches expenses by type
 */
export async function getExpensesByType(
  supabase: SupabaseClient,
  userId: string,
  type: "expense" | "subscription"
) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .eq("type", type)
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data as Expense[];
}

/**
 * Creates a new expense
 */
export async function createExpense(
  supabase: SupabaseClient,
  userId: string,
  expense: {
    name: string;
    amount: number;
    due_date: number; // Day of month (1-31)
    category: string;
    type: "expense" | "subscription";
    logo?: string;
  }
) {
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: userId,
      ...expense,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
}

/**
 * Updates an expense
 */
export async function updateExpense(
  supabase: SupabaseClient,
  expenseId: string,
  updates: {
    name?: string;
    amount?: number;
    due_date?: number; // Day of month (1-31)
    category?: string;
    logo?: string;
  }
) {
  const { data, error } = await supabase
    .from("expenses")
    .update(updates)
    .eq("id", expenseId)
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
}


/**
 * Deletes an expense
 */
export async function deleteExpense(supabase: SupabaseClient, expenseId: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

  if (error) throw error;
}

/**
 * Calculates total expenses by type
 */
export async function calculateTotalByType(
  supabase: SupabaseClient,
  userId: string,
  type: "expense" | "subscription"
) {
  const expenses = await getExpensesByType(supabase, userId, type);
  return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
}

/**
 * Calculates expenses by category
 */
export async function getExpensesByCategory(supabase: SupabaseClient, userId: string) {
  const expenses = await getExpenses(supabase, userId);

  const byCategory: Record<string, number> = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Other";
    byCategory[category] = (byCategory[category] || 0) + Number(expense.amount);
  });

  return byCategory;
}
