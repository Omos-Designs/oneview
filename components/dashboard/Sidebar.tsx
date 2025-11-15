"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/libs/supabase/client";
import { useSidebar } from "./SidebarContext";

const Sidebar = () => {
  const router = useRouter();
  const { isPinned, setIsPinned } = useSidebar();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Detect if we're in demo-dashboard or regular dashboard
  const basePath = pathname?.startsWith("/demo-dashboard") ? "/demo-dashboard" : "/dashboard";

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
    <aside className={`fixed left-0 top-0 h-screen bg-base-300/50 backdrop-blur-md border-r border-base-content/10 flex flex-col z-50 transition-all duration-300 ${isPinned ? 'w-64' : 'w-20'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 py-6 border-b border-base-content/10 ${isPinned ? 'px-6' : 'px-4 justify-center'}`}>
        <Link href="/" className={`flex items-center gap-3 group ${!isPinned && 'justify-center'}`}>
          <Image
            src="/oneview_logo.svg"
            alt="OneView"
            width={48}
            height={48}
            className="group-hover:scale-110 transition-transform"
          />
          {isPinned && <span className="font-bold text-lg whitespace-nowrap">OneView</span>}
        </Link>
      </div>

      {/* Pin Button */}
      <div className={`py-3 ${isPinned ? 'px-6' : 'px-2 flex justify-center'}`}>
        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`btn btn-ghost btn-sm ${!isPinned && 'btn-square'}`}
          title={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
        >
          {isPinned ? (
            <>
              {/* Pinned - Vertical Pin Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M16.5 12V11.25C16.5 10.837 16.837 10.5 17.25 10.5H17.625C18.038 10.5 18.375 10.163 18.375 9.75V6.375C18.375 5.962 18.038 5.625 17.625 5.625H6.375C5.962 5.625 5.625 5.962 5.625 6.375V9.75C5.625 10.163 5.962 10.5 6.375 10.5H6.75C7.163 10.5 7.5 10.837 7.5 11.25V12C7.5 13.242 6.492 14.25 5.25 14.25H5.0625C4.649 14.25 4.3125 14.587 4.3125 15V16.5C4.3125 16.913 4.649 17.25 5.0625 17.25H11.25V21.75C11.25 22.164 11.586 22.5 12 22.5C12.414 22.5 12.75 22.164 12.75 21.75V17.25H18.9375C19.351 17.25 19.6875 16.913 19.6875 16.5V15C19.6875 14.587 19.351 14.25 18.9375 14.25H18.75C17.508 14.25 16.5 13.242 16.5 12Z"/>
              </svg>
              <span className="text-xs">Unpin</span>
            </>
          ) : (
            /* Unpinned - Angled Pin Icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transform rotate-45">
              <path d="M16.5 12V11.25C16.5 10.837 16.837 10.5 17.25 10.5H17.625C18.038 10.5 18.375 10.163 18.375 9.75V6.375C18.375 5.962 18.038 5.625 17.625 5.625H6.375C5.962 5.625 5.625 5.962 5.625 6.375V9.75C5.625 10.163 5.962 10.5 6.375 10.5H6.75C7.163 10.5 7.5 10.837 7.5 11.25V12C7.5 13.242 6.492 14.25 5.25 14.25H5.0625C4.649 14.25 4.3125 14.587 4.3125 15V16.5C4.3125 16.913 4.649 17.25 5.0625 17.25H11.25V21.75C11.25 22.164 11.586 22.5 12 22.5C12.414 22.5 12.75 22.164 12.75 21.75V17.25H18.9375C19.351 17.25 19.6875 16.913 19.6875 16.5V15C19.6875 14.587 19.351 14.25 18.9375 14.25H18.75C17.508 14.25 16.5 13.242 16.5 12Z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-2 space-y-1 overflow-x-hidden ${isPinned ? 'px-4' : 'px-2'}`}>
        {/* MAIN */}
        {isPinned && (
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
              Main
            </p>
          </div>
        )}
        <Link
          href={basePath}
          data-tour="sidebar-dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
            pathname === basePath
              ? "bg-accent/10 text-accent"
              : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
          } ${!isPinned && 'justify-center'}`}
          title={!isPinned ? "Dashboard" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 flex-shrink-0"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          {isPinned && <span className="whitespace-nowrap">Dashboard</span>}
        </Link>

        {/* FINANCES */}
        {isPinned && (
          <div className="px-3 py-2 mt-4">
            <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
              Finances
            </p>
          </div>
        )}
        {!isPinned && <div className="divider my-2"></div>}
        <Link
          href={`${basePath}/accounts`}
          data-tour="sidebar-accounts"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname === `${basePath}/accounts`
              ? "bg-accent/10 text-accent font-medium"
              : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
          } ${!isPinned && 'justify-center'}`}
          title={!isPinned ? "Bank Accounts" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 flex-shrink-0"
          >
            <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h10.5a.75.75 0 010 1.5H12v13.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V3.5h-.25A.75.75 0 011 2.75zM4 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM4.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM8 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM8.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM14.25 6a.75.75 0 00-.75.75V17a1 1 0 001 1h3.75a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75h-3.25zm.5 3.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z" clipRule="evenodd" />
          </svg>
          {isPinned && <span className="whitespace-nowrap">Bank Accounts</span>}
        </Link>
        <Link
          href={`${basePath}/credit-cards`}
          data-tour="sidebar-cards"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname === `${basePath}/credit-cards`
              ? "bg-accent/10 text-accent font-medium"
              : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
          } ${!isPinned && 'justify-center'}`}
          title={!isPinned ? "Credit Cards" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
              clipRule="evenodd"
            />
          </svg>
          {isPinned && <span className="whitespace-nowrap">Credit Cards</span>}
        </Link>
        <Link
          href={`${basePath}/income`}
          data-tour="sidebar-income"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname === `${basePath}/income`
              ? "bg-accent/10 text-accent font-medium"
              : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
          } ${!isPinned && 'justify-center'}`}
          title={!isPinned ? "Income" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          {isPinned && <span className="whitespace-nowrap">Income</span>}
        </Link>
        <Link
          href={`${basePath}/expenses`}
          data-tour="sidebar-expenses"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname === `${basePath}/expenses`
              ? "bg-accent/10 text-accent font-medium"
              : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
          } ${!isPinned && 'justify-center'}`}
          title={!isPinned ? "Expenses" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          {isPinned && <span className="whitespace-nowrap">Expenses</span>}
        </Link>
        <Link
          href={`${basePath}/analytics`}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname === `${basePath}/analytics`
              ? "bg-accent/10 text-accent font-medium"
              : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
          } ${!isPinned && 'justify-center'}`}
          title={!isPinned ? "Analytics" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 flex-shrink-0"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          {isPinned && <span className="whitespace-nowrap">Analytics</span>}
        </Link>

        {/* ACCOUNT */}
        {isPinned && (
          <div className="px-3 py-2 mt-4">
            <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
              Account
            </p>
          </div>
        )}
        {!isPinned && <div className="divider my-2"></div>}
        <Link
          href={`${basePath}/settings`}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname === `${basePath}/settings`
              ? "bg-accent/10 text-accent font-medium"
              : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
          } ${!isPinned && 'justify-center'}`}
          title={!isPinned ? "Settings" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          {isPinned && <span className="whitespace-nowrap">Settings</span>}
        </Link>
      </nav>

      {/* User Profile with Dropdown */}
      <div className={`border-t border-base-content/10 ${isPinned ? 'p-4' : 'p-2'}`}>
        <div className="dropdown dropdown-top dropdown-end w-full">
          <button
            tabIndex={0}
            className={`flex items-center gap-3 w-full rounded-lg hover:bg-base-content/5 transition-colors ${isPinned ? 'p-2' : 'p-1 justify-center'}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar">
              <div className={`rounded-full overflow-hidden ${isPinned ? 'w-10 h-10' : 'w-8 h-8'}`}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-accent flex items-center justify-center text-white font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {isPinned && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="font-semibold text-sm truncate">{displayName}</p>
                <p className="text-xs text-base-content/60 truncate">{displayEmail}</p>
              </div>
            )}
          </button>
          <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-lg w-52 border border-base-content/10 mb-2">
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
    </aside>
  );
};

export default Sidebar;
