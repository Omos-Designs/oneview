import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetches the user's profile including plan information
 */
export async function getUserProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Updates user profile fields
 */
export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: {
    name?: string;
    email?: string;
    image?: string;
  }
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Checks if user has access (has paid)
 */
export async function checkUserAccess(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("has_access, plan_category")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return {
    hasAccess: data.has_access,
    planCategory: data.plan_category as "manual" | "plaid" | null,
  };
}
