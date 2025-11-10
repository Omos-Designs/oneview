"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: React.ReactElement;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  // All searchable items
  const searchableItems: SearchResult[] = [
    {
      title: "Dashboard",
      description: "View your financial overview",
      href: "/demo-dashboard",
      category: "Pages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      title: "Bank Accounts",
      description: "Manage your bank accounts",
      href: "/demo-dashboard/accounts",
      category: "Pages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Credit Cards",
      description: "View and manage credit cards",
      href: "/demo-dashboard/credit-cards",
      category: "Pages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Income",
      description: "Track your income sources",
      href: "/demo-dashboard/income",
      category: "Pages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Expenses",
      description: "Manage your expenses",
      href: "/demo-dashboard/expenses",
      category: "Pages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Analytics",
      description: "View financial analytics",
      href: "/demo-dashboard/analytics",
      category: "Pages",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
  ];

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults(searchableItems);
    } else {
      const query = searchQuery.toLowerCase();
      const results = searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
      setFilteredResults(results);
    }
  }, [searchQuery]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          setSearchQuery("");
        }
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle result selection
  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl p-0 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-base-content/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-base-content/60"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search pages..."
            className="flex-1 bg-transparent outline-none text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <kbd className="kbd kbd-sm">ESC</kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 mx-auto text-base-content/30 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <p className="text-base-content/60">No results found for &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(result.href)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-base-content/5 transition-colors text-left"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent">
                    {result.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{result.title}</p>
                    <p className="text-xs text-base-content/60">{result.description}</p>
                  </div>
                  <span className="badge badge-sm badge-ghost">{result.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-base-content/10 bg-base-200/50">
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <kbd className="kbd kbd-xs">↑</kbd>
            <kbd className="kbd kbd-xs">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <kbd className="kbd kbd-xs">Enter</kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
};

export default SearchModal;
