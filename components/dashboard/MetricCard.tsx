import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  tooltip?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, subtitle, tooltip, trend, icon }: MetricCardProps) => {
  return (
    <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:scale-[1.02]">
      <div className="card-body p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1">
            <h3 className="text-[10px] sm:text-xs font-semibold text-base-content/70 uppercase tracking-wider">
              {title}
            </h3>
            {tooltip && (
              <div className="tooltip tooltip-right" data-tip={tooltip}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3 text-base-content/40 hover:text-accent cursor-help"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="text-base-content/40">
            {icon}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">{value}</p>

          {subtitle && (
            <p className="text-xs text-base-content/60">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <span className={trend.isPositive ? "text-success" : "text-error"}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-base-content/50">from last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
