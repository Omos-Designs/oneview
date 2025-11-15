import { SupabaseClient } from "@supabase/supabase-js";

export type BankAccount = {
  id: string;
  user_id: string;
  name: string;
  type: "checking" | "savings" | "other";
  balance: number;
  provider: string | null;
  logo: string | null;
  is_active: boolean;
  plaid_account_id: string | null;
  plaid_access_token: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Fetches all bank accounts for a user
 */
export async function getBankAccounts(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as BankAccount[];
}

/**
 * Fetches active bank accounts only
 */
export async function getActiveBankAccounts(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as BankAccount[];
}

/**
 * Creates a new bank account (manual entry)
 */
export async function createBankAccount(
  supabase: SupabaseClient,
  userId: string,
  account: {
    name: string;
    type: "checking" | "savings" | "other";
    balance: number;
    provider?: string;
    logo?: string;
  }
) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      user_id: userId,
      ...account,
    })
    .select()
    .single();

  if (error) throw error;
  return data as BankAccount;
}

/**
 * Updates bank account (typically balance for manual users)
 */
export async function updateBankAccount(
  supabase: SupabaseClient,
  accountId: string,
  updates: {
    name?: string;
    balance?: number;
    is_active?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .update(updates)
    .eq("id", accountId)
    .select()
    .single();

  if (error) throw error;
  return data as BankAccount;
}

/**
 * Deletes a bank account
 */
export async function deleteBankAccount(supabase: SupabaseClient, accountId: string) {
  const { error } = await supabase.from("bank_accounts").delete().eq("id", accountId);

  if (error) throw error;
}

/**
 * Calculates total assets from active bank accounts
 */
export async function calculateTotalAssets(supabase: SupabaseClient, userId: string) {
  const accounts = await getActiveBankAccounts(supabase, userId);
  return accounts.reduce((total, account) => total + Number(account.balance), 0);
}
