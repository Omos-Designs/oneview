import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import config from "@/config";
import { SidebarProvider } from "@/components/dashboard/SidebarContext";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// The SidebarProvider wraps all dashboard pages to manage sidebar state
export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(config.auth.loginUrl);
  }

  // Check if user has paid for access
  const { data: profile } = await supabase
    .from("profiles")
    .select("has_access, plan_category, price_id")
    .eq("id", user.id)
    .single();

  // If user doesn't have a profile yet, create one
  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      has_access: false,
    });
    // Redirect to pricing page - user needs to pay
    redirect("/#pricing");
  }

  // If user hasn't paid yet, redirect to pricing
  if (!profile.has_access) {
    redirect("/#pricing");
  }

  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
