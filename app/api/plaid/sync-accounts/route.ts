import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { createClient } from "@/libs/supabase/server";

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

/**
 * Syncs account balances from Plaid for all user's connected accounts
 * Can be called manually by user or automatically via cron job
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all Plaid-linked accounts for this user
    const { data: accounts, error: fetchError } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("user_id", user.id)
      .not("plaid_access_token", "is", null);

    if (fetchError || !accounts || accounts.length === 0) {
      return NextResponse.json(
        { error: "No Plaid accounts found" },
        { status: 404 }
      );
    }

    // Group accounts by access token (one API call per institution)
    const accountsByToken = accounts.reduce((acc, account) => {
      const token = account.plaid_access_token;
      if (!acc[token]) {
        acc[token] = [];
      }
      acc[token].push(account);
      return acc;
    }, {} as Record<string, any[]>);

    const updatedAccounts = [];

    // Sync balances for each access token
    for (const [accessToken, tokenAccounts] of Object.entries(accountsByToken) as [string, any[]][]) {
      try {
        const balancesResponse = await plaidClient.accountsBalanceGet({
          access_token: accessToken,
        });

        const plaidAccounts = balancesResponse.data.accounts;

        // Update each account's balance
        for (const account of tokenAccounts) {
          const plaidAccount = plaidAccounts.find(
            (pa: any) => pa.account_id === account.plaid_account_id
          );

          if (plaidAccount) {
            const { error: updateError } = await supabase
              .from("bank_accounts")
              .update({
                balance: plaidAccount.balances.current || 0,
                last_synced_at: new Date().toISOString(),
              })
              .eq("id", account.id);

            if (!updateError) {
              updatedAccounts.push({
                ...account,
                balance: plaidAccount.balances.current || 0,
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error syncing token ${accessToken}:`, error);
        // Continue with other tokens even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      synced_count: updatedAccounts.length,
      accounts: updatedAccounts,
    });
  } catch (error) {
    console.error("Error syncing accounts:", error);
    return NextResponse.json(
      { error: "Failed to sync accounts" },
      { status: 500 }
    );
  }
}
