import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "OneView",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "See your complete financial picture in one place. Know exactly what you can spend after upcoming bills with instant green/red health indicators.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "one-view.app",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_manual_monthly",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Manual Monthly",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for those who prefer manual control",
        // The price you want to display, the one user will be charged on Stripe.
        price: 2,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: null,
        // Category to group plans by linking type
        category: "manual",
        features: [
          {
            name: "Financial health dashboard",
          },
          { name: "Manual balance updates" },
          { name: "Track unlimited accounts & cards" },
          { name: "Recurring income & expense tracking" },
          { name: "Available after liabilities calculation" },
          { name: "Update balances at your own pace" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_manual_lifetime",
        name: "Manual Lifetime",
        description: "One-time payment, manual control forever",
        isFeatured: true,
        price: 14,
        priceAnchor: null,
        category: "manual",
        features: [
          {
            name: "Everything in Manual Monthly",
          },
          { name: "One-time payment" },
          { name: "Lifetime access" },
          { name: "Early adopter pricing" },
          { name: "All future updates included" },
          { name: "No recurring fees" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h_plaid"
            : "price_plaid_monthly",
        name: "Pro Monthly",
        description: "Full automation with Plaid integration",
        price: 7,
        priceAnchor: null,
        category: "plaid",
        features: [
          {
            name: "Connect unlimited bank accounts",
          },
          { name: "Real-time balance syncing with Plaid" },
          { name: "Automatic transaction tracking" },
          { name: "Financial health dashboard" },
          { name: "Recurring income & expense tracking" },
          { name: "Available after liabilities calculation" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw_plaid"
            : "price_plaid_lifetime",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        name: "Pro Lifetime",
        description: "One-time payment, automated forever",
        price: 49,
        priceAnchor: null,
        category: "plaid",
        features: [
          {
            name: "Everything in Pro Monthly",
          },
          { name: "One-time payment" },
          { name: "Lifetime Plaid integration" },
          { name: "Early adopter pricing" },
          { name: "Limited time offer" },
          { name: "All future updates included" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `OneView <noreply@one-view.app>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `OneView Team <support@one-view.app>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@one-view.app",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: "#6e56cf",
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
