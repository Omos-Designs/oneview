"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";
import Image from "next/image";

function SettingsPageContent() {
  const { isPinned } = useSidebar();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);

  const handleReset = () => {
    setEmailNotifications(true);
    setWeeklyReport(true);
    setBillReminders(true);
    setLowBalanceAlert(true);
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleSavePreferences = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Preferences saved successfully!");
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Password updated successfully!");
  };

  const handleExportData = () => {
    alert("Data export started! You'll receive an email with your data shortly.");
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      alert("Account deletion initiated. You'll receive a confirmation email.");
    }
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className={`flex-1 transition-all duration-300 ${isPinned ? 'ml-64' : 'ml-20'}`}>
        <TopBar onReset={handleReset} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-base-content/60 mt-1">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <form onSubmit={handleSaveProfile}>
            <CollapsibleSection
              title="Profile Information"
              badge="Required"
              defaultOpen={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2">
                      <Image src="/profile.svg" alt="Profile" width={96} height={96} />
                    </div>
                  </div>
                  <div>
                    <button type="button" className="btn btn-sm btn-accent">
                      Change Photo
                    </button>
                    <p className="text-xs text-base-content/60 mt-2">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">First Name</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      defaultValue="Demo"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Last Name</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      defaultValue="User"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue="demo@one-view.app"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn btn-accent">
                    Save Changes
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          </form>

          {/* Preferences Section */}
          <form onSubmit={handleSavePreferences}>
            <CollapsibleSection
              title="Preferences"
              badge="Optional"
              defaultOpen={false}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Currency</span>
                    </label>
                    <select name="currency" defaultValue="USD" className="select select-bordered w-full">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Date Format</span>
                    </label>
                    <select name="dateFormat" defaultValue="MM/DD/YYYY" className="select select-bordered w-full">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Timezone</span>
                    </label>
                    <select name="timezone" defaultValue="America/New_York" className="select select-bordered w-full">
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Language</span>
                    </label>
                    <select name="language" defaultValue="en" className="select select-bordered w-full">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn btn-accent">
                    Save Preferences
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          </form>

          {/* Notifications Section */}
          <CollapsibleSection
            title="Notifications"
            badge="Optional"
            defaultOpen={false}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Email Notifications</span>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      Receive email updates about your account
                    </p>
                  </div>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    checked={weeklyReport}
                    onChange={(e) => setWeeklyReport(e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Weekly Financial Report</span>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      Get a summary of your finances every Monday
                    </p>
                  </div>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    checked={billReminders}
                    onChange={(e) => setBillReminders(e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Bill Reminders</span>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      Reminders 3 days before bills are due
                    </p>
                  </div>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    checked={lowBalanceAlert}
                    onChange={(e) => setLowBalanceAlert(e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Low Balance Alerts</span>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      Alert when account balance falls below threshold
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </CollapsibleSection>

          {/* Security Section */}
          <form onSubmit={handleChangePassword}>
            <CollapsibleSection
              title="Security"
              badge="Optional"
              defaultOpen={false}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Current Password</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">New Password</span>
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div className="divider"></div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" className="checkbox checkbox-accent" />
                    <div>
                      <span className="label-text font-medium">Enable Two-Factor Authentication</span>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn btn-accent">
                    Update Password
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          </form>

          {/* Danger Zone */}
          <CollapsibleSection
            title="Danger Zone"
            defaultOpen={false}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            }
          >
            <div className="space-y-4">
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm">These actions cannot be undone. Please be careful.</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-base-content/10 rounded-lg">
                <div>
                  <div className="font-medium">Export Your Data</div>
                  <div className="text-sm text-base-content/60 mt-1">
                    Download all your financial data in JSON format
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="btn btn-sm btn-outline"
                >
                  Export Data
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-error/30 bg-error/5 rounded-lg">
                <div>
                  <div className="font-medium text-error">Delete Account</div>
                  <div className="text-sm text-base-content/60 mt-1">
                    Permanently delete your account and all data
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="btn btn-sm btn-error"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <SettingsPageContent />
    </SidebarProvider>
  );
}
