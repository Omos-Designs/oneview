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
 * Exchanges a public token for an access token and creates bank account records
 * Called after user successfully links their bank via Plaid Link
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_token } = await req.json();

    if (!public_token) {
      return NextResponse.json(
        { error: "Public token is required" },
        { status: 400 }
      );
    }

    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Get account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accounts = accountsResponse.data.accounts;

    // Insert accounts into database
    const accountsToInsert = accounts.map((account: any) => ({
      user_id: user.id,
      name: account.name,
      type: account.subtype === "checking" || account.subtype === "savings"
        ? account.subtype
        : "other",
      balance: account.balances.current || 0,
      provider: accountsResponse.data.item.institution_id,
      plaid_account_id: account.account_id,
      plaid_access_token: accessToken,
      last_synced_at: new Date().toISOString(),
      is_active: true,
    }));

    const { data: insertedAccounts, error } = await supabase
      .from("bank_accounts")
      .insert(accountsToInsert)
      .select();

    if (error) {
      console.error("Error inserting accounts:", error);
      return NextResponse.json(
        { error: "Failed to save accounts" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accounts: insertedAccounts,
      item_id: itemId,
    });
  } catch (error) {
    console.error("Error exchanging token:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 }
    );
  }
}
