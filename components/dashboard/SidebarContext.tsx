"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isPinned, setIsPinned] = useState(true);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarPinned");
    if (savedState !== null) {
      setIsPinned(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage
  const handleSetPinned = (pinned: boolean) => {
    setIsPinned(pinned);
    localStorage.setItem("sidebarPinned", String(pinned));
  };

  return (
    <SidebarContext.Provider value={{ isPinned, setIsPinned: handleSetPinned }}>
      {children}
    </SidebarContext.Provider>
  );
};
