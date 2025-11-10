"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";

export default function AddIncomePage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would save to database
    alert("Income added successfully!");
    router.push("/demo-dashboard");
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <TopBar onReset={() => {}} />

        <main className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/demo-dashboard" className="btn btn-ghost btn-sm">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Add Income Source</h1>
            <p className="text-base-content/60 mt-2">
              Track your recurring income streams
            </p>
          </div>

          <div className="card bg-base-200/50 backdrop-blur-sm border border-base-content/10 max-w-3xl">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <CollapsibleSection
                  title="Basic Information"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Income Source</span>
                      </label>
                      <input
                        type="text"
                        name="source"
                        placeholder="e.g., Salary, Freelance, Side Hustle"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Payment Details"
                  badge="Required"
                  defaultOpen={true}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Amount ($)</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        step="0.01"
                        placeholder="0.00"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Frequency</span>
                      </label>
                      <select name="frequency" className="select select-bordered w-full" required>
                        <option value="">Select frequency...</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Next Payment Date</span>
                      </label>
                      <input
                        type="text"
                        name="nextDate"
                        placeholder="e.g., Dec 25, 2025"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <div className="flex justify-end gap-2 pt-4">
                  <Link href="/demo-dashboard" className="btn btn-ghost">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-accent">
                    Add Income Source
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
