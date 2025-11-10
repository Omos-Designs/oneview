"use client";

export default function DemoBanner() {
  return (
    <div className="alert bg-purple-500/10 border border-purple-500/30 mb-4 sm:mb-6 flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-purple-500 shrink-0 w-5 h-5 sm:w-6 sm:h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div className="flex-1 w-full sm:w-auto">
        <h3 className="font-semibold text-purple-500 text-sm sm:text-base">Manual Mode</h3>
        <div className="text-xs sm:text-sm text-base-content/80 mt-0.5">
          You&apos;re currently in <strong>Manual Mode</strong> where you track and update everything yourself.{" "}
          <span className="hidden sm:inline">
            With <strong className="text-purple-500">Plaid linking enabled</strong>, all of this would be fully automated—your
            accounts, balances, and subscriptions would sync automatically in real-time with zero manual entry!
          </span>
          <span className="sm:hidden">
            <strong className="text-purple-500">Upgrade to Pro</strong> for automatic syncing with Plaid!
          </span>
        </div>
      </div>
      <div className="w-full sm:w-auto">
        <button className="btn btn-sm bg-purple-500 hover:bg-purple-600 text-white border-none w-full sm:w-auto">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
