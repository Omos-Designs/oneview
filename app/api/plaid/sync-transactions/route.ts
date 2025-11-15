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
 * Syncs recent transactions from Plaid for all user's connected accounts
 * Fetches last 30 days of transactions and stores them for expense/income matching
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

    // Group accounts by access token
    const accountsByToken = accounts.reduce((acc, account) => {
      const token = account.plaid_access_token;
      if (!acc[token]) {
        acc[token] = [];
      }
      acc[token].push(account);
      return acc;
    }, {} as Record<string, typeof accounts>);

    let totalTransactions = 0;

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Fetch and store transactions for each access token
    for (const [accessToken, tokenAccounts] of Object.entries(accountsByToken)) {
      try {
        const transactionsResponse = await plaidClient.transactionsGet({
          access_token: accessToken,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        });

        const transactions = transactionsResponse.data.transactions;

        // Map transactions to our database format
        const transactionsToInsert = transactions.map((txn: any) => {
          // Find matching account in our database
          const account = (tokenAccounts as any[]).find(
            (acc: any) => acc.plaid_account_id === txn.account_id
          );

          return {
            user_id: user.id,
            plaid_transaction_id: txn.transaction_id,
            account_id: account?.id || null,
            amount: txn.amount,
            date: txn.date,
            description: txn.name,
            category: txn.category?.[0] || "Other",
            is_pending: txn.pending,
          };
        });

        // Upsert transactions (insert or update if already exists)
        const { error: insertError } = await supabase
          .from("transactions")
          .upsert(transactionsToInsert, {
            onConflict: "plaid_transaction_id",
            ignoreDuplicates: false,
          });

        if (!insertError) {
          totalTransactions += transactions.length;
        }
      } catch (error) {
        console.error(`Error syncing transactions for token:`, error);
        // Continue with other tokens even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      transactions_synced: totalTransactions,
    });
  } catch (error) {
    console.error("Error syncing transactions:", error);
    return NextResponse.json(
      { error: "Failed to sync transactions" },
      { status: 500 }
    );
  }
}
