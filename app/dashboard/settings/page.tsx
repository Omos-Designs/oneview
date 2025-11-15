"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/components/dashboard/SidebarContext";
import { createClient } from "@/libs/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function Settings() {
  const { isPinned } = useSidebar();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="flex min-h-screen bg-base-200">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? "ml-64" : "ml-20"}`}>
        <TopBar />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-base-content/60 mt-1 sm:mt-2">
              Manage your account preferences and settings
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">Profile Information</h2>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="avatar">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-accent flex items-center justify-center text-white font-bold text-2xl">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{displayName}</p>
                      <p className="text-sm text-base-content/60">{displayEmail}</p>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Subscription Plan</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-accent badge-lg">
                          {profile?.plan_category === "manual" ? "Manual" : profile?.plan_category === "plaid" ? "Pro" : "Free"} Plan
                        </span>
                        {profile?.has_access && (
                          <span className="badge badge-success badge-lg">Active</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Account Status</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {profile?.has_access ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-success">Full Access</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-warning">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <span className="text-warning">Limited Access</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* More Settings Coming Soon */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="flex justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12 text-accent"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold mb-2">More Settings Coming Soon</h3>
                  <p className="text-base-content/70 mb-4">
                    We&apos;re working on additional settings including:
                  </p>

                  <div className="text-left max-w-md mx-auto space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>Notification preferences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>Currency & timezone settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>Privacy controls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>Data export & backup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>Billing & subscription management</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
