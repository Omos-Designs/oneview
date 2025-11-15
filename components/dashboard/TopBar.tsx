"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/libs/supabase/client";
import SearchModal from "./SearchModal";

interface TopBarProps {
  onReset?: () => void;
}

const TopBar = ({ onReset }: TopBarProps = {}) => {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);
      }
    };

    fetchUser();
  }, []);

  // Load theme from localStorage on mount - default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light"; // Always default to light
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Sign out handler
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  // Get user display name and avatar
  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <>
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 bg-base-100/95 backdrop-blur-md border-b border-base-content/10">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Search Bar */}
          <button
            data-tour="search-bar"
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-base-content/5 hover:bg-base-content/10 transition-colors border border-base-content/10 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-base-content/60"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span className="text-base-content/60">Search...</span>
            <kbd className="kbd kbd-sm">⌘K</kbd>
          </button>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="btn btn-sm btn-circle btn-ghost" title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              )}
            </button>

            {/* User Menu with Dropdown */}
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-sm btn-circle btn-ghost">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent flex items-center justify-center text-white font-semibold text-sm">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </button>
              <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-lg w-52 border border-base-content/10 mt-2">
                <li className="menu-title px-4 py-2">
                  <span className="text-xs font-semibold">{displayName}</span>
                  <span className="text-xs opacity-60">{displayEmail}</span>
                </li>
                <li><a className="text-sm">Profile</a></li>
                <li><a className="text-sm">Settings</a></li>
                <div className="divider my-1"></div>
                <li><button onClick={handleSignOut} className="text-sm text-error">Sign Out</button></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
};

export default TopBar;
