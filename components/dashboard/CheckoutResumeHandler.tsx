"use client";

import { useEffect } from "react";
import apiClient from "@/libs/api";
import { createClient } from "@/libs/supabase/client";

// This component checks if the user had started a checkout before authenticating
// If so, it automatically resumes the checkout flow
// This works for both magic link and Google OAuth authentication
export default function CheckoutResumeHandler(): null {
  useEffect(() => {
    const resumeCheckout = async () => {
      // Check if user had a checkout intent stored before signing in
      // Use localStorage (not sessionStorage) so it persists across tabs for Magic Link auth
      const storedIntent = localStorage.getItem("checkout-intent");

      console.log("[CheckoutResume] Stored intent:", storedIntent);

      if (!storedIntent) return;

      // Only attempt resume if user is authenticated
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("[CheckoutResume] User authenticated:", !!user);

      if (!user) {
        // User not authenticated yet, leave intent in storage for next time
        console.log("[CheckoutResume] No user, keeping intent for later");
        return;
      }

      try {
        const { priceId, mode } = JSON.parse(storedIntent);

        console.log("[CheckoutResume] Resuming checkout for:", { priceId, mode });

        // Clear the intent immediately to prevent repeated attempts
        localStorage.removeItem("checkout-intent");

        // Create checkout session
        const { url }: { url: string } = await apiClient.post(
          "/stripe/create-checkout",
          {
            priceId,
            successUrl: window.location.origin + "/dashboard?from=stripe",
            cancelUrl: window.location.origin + "/#pricing",
            mode,
          }
        );

        console.log("[CheckoutResume] Redirecting to Stripe:", url);

        // Redirect to Stripe checkout
        window.location.href = url;
      } catch (e) {
        console.error("[CheckoutResume] Failed to resume checkout:", e);
        // If checkout fails, clear intent and let user try again
        localStorage.removeItem("checkout-intent");
      }
    };

    // Small delay to ensure auth state is fully settled
    const timer = setTimeout(resumeCheckout, 500);

    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything
  return null;
}
