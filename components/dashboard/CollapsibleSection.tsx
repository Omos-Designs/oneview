"use client";

import React, { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  badge?: "Required" | "Optional" | "Auto-filled";
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const CollapsibleSection = ({
  title,
  badge,
  defaultOpen = true,
  children,
  icon,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const badgeStyles = {
    Required: "badge-error",
    Optional: "badge-ghost",
    "Auto-filled": "badge-success",
  };

  return (
    <div className="border border-base-content/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-base-200/30 hover:bg-base-200/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-base-content/60">{icon}</div>}
          <h3 className="font-semibold text-sm">{title}</h3>
          {badge && (
            <span className={`badge badge-sm ${badgeStyles[badge]}`}>
              {badge}
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
