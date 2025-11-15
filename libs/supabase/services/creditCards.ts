import { SupabaseClient } from "@supabase/supabase-js";

export type CreditCard = {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  credit_limit: number;
  due_date: string | null;
  logo: string | null;
  is_active: boolean;
  plaid_account_id: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Fetches all credit cards for a user
 */
export async function getCreditCards(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("credit_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as CreditCard[];
}

/**
 * Fetches active credit cards only
 */
export async function getActiveCreditCards(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("credit_cards")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false});

  if (error) throw error;
  return data as CreditCard[];
}

/**
 * Creates a new credit card (manual entry)
 */
export async function createCreditCard(
  supabase: SupabaseClient,
  userId: string,
  card: {
    name: string;
    balance: number;
    credit_limit: number;
    due_date?: string;
    logo?: string;
  }
) {
  const { data, error } = await supabase
    .from("credit_cards")
    .insert({
      user_id: userId,
      ...card,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CreditCard;
}

/**
 * Updates credit card (typically balance for manual users)
 */
export async function updateCreditCard(
  supabase: SupabaseClient,
  cardId: string,
  updates: {
    name?: string;
    balance?: number;
    credit_limit?: number;
    due_date?: string;
    is_active?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("credit_cards")
    .update(updates)
    .eq("id", cardId)
    .select()
    .single();

  if (error) throw error;
  return data as CreditCard;
}

/**
 * Deletes a credit card
 */
export async function deleteCreditCard(supabase: SupabaseClient, cardId: string) {
  const { error } = await supabase.from("credit_cards").delete().eq("id", cardId);

  if (error) throw error;
}

/**
 * Calculates total liabilities from active credit cards
 */
export async function calculateTotalLiabilities(supabase: SupabaseClient, userId: string) {
  const cards = await getActiveCreditCards(supabase, userId);
  return cards.reduce((total, card) => total + Math.abs(Number(card.balance)), 0);
}

/**
 * Calculates total available credit from active credit cards
 */
export async function calculateAvailableCredit(supabase: SupabaseClient, userId: string) {
  const cards = await getActiveCreditCards(supabase, userId);
  return cards.reduce(
    (total, card) => total + (Number(card.credit_limit) - Number(card.balance)),
    0
  );
}
