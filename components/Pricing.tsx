"use client";

import { useState } from "react";
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  const [isPlaidEnabled, setIsPlaidEnabled] = useState(false);

  // Get plans based on toggle state
  const monthlyPlan = config.stripe.plans.find(
    (plan) => plan.category === (isPlaidEnabled ? "plaid" : "manual") && plan.name.includes("Monthly")
  );
  const lifetimePlan = config.stripe.plans.find(
    (plan) => plan.category === (isPlaidEnabled ? "plaid" : "manual") && !plan.name.includes("Monthly")
  );

  const plans = [monthlyPlan, lifetimePlan].filter(Boolean);

  return (
    <section className="section-spacing bg-background-muted" id="pricing">
      <div className="container-primary max-w-5xl">
        <div className="flex flex-col text-center w-full mb-8 md:mb-12">
          <p className="font-semibold text-sm text-accent mb-3 uppercase tracking-wider">
            Pricing
          </p>
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
            Choose between manual updates or automated account linking
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-full border-2 border-border-subtle shadow-lg">
            <button
              onClick={() => setIsPlaidEnabled(false)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                !isPlaidEnabled
                  ? "bg-accent text-white shadow-md scale-105"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setIsPlaidEnabled(true)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                isPlaidEnabled
                  ? "bg-accent text-white shadow-md scale-105"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.828a.75.75 0 010 1.061L6.11 12.95a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm3.594-3.317a.75.75 0 00-1.37.364l-.492 6.861a.75.75 0 001.204.65l1.043-.799.985 3.678a.75.75 0 001.45-.388l-.978-3.646 1.292.204a.75.75 0 00.62-1.345l-6.214-4.192z"
                  clipRule="evenodd"
                />
              </svg>
              Automatic Linking
            </button>
          </div>
          <p className="text-sm text-base-content/60 mt-4 max-w-md text-center">
            {isPlaidEnabled
              ? "Real-time balance syncing with secure Plaid integration"
              : "Full control — update your balances at your own pace"}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <div key={plan.priceId} className="relative w-full max-w-lg">
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span className="badge text-xs text-white font-semibold border-0 bg-accent px-3 py-2">
                    POPULAR
                  </span>
                </div>
              )}

              {plan.isFeatured && (
                <div className="absolute -inset-[1px] rounded-[13px] bg-accent z-10"></div>
              )}

              <div
                className={`relative flex flex-col h-full gap-5 lg:gap-6 z-10 bg-background p-6 md:p-8 rounded-xl border border-border-subtle shadow-lg transition-all duration-300 ${
                  plan.isFeatured ? "ring-2 ring-accent/20" : ""
                }`}
              >
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="text-lg lg:text-xl font-bold">
                      {plan.name.replace("Manual ", "").replace("Pro ", "")}
                    </p>
                    {plan.description && (
                      <p className="text-base-content/80 mt-2">{plan.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {plan.priceAnchor && (
                    <div className="flex flex-col justify-end mb-[4px] text-lg">
                      <p className="relative">
                        <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[53%]"></span>
                        <span className="text-base-content/80">${plan.priceAnchor}</span>
                      </p>
                    </div>
                  )}
                  <p className="text-5xl tracking-tight font-extrabold">${plan.price}</p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-base-content/60 uppercase font-semibold">USD</p>
                  </div>
                </div>
                {plan.features && (
                  <ul className="space-y-3 leading-relaxed text-sm flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-accent shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-base-content/80">{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="space-y-2">
                  <ButtonCheckout priceId={plan.priceId} />
                  {plan.name.includes("Lifetime") && (
                    <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/80 font-medium relative">
                      Pay once. Access forever.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base-content/60 text-sm">
            All plans include access to your financial health dashboard and recurring expense
            tracking.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
