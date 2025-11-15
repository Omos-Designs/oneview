"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='sidebar-dashboard']",
    title: "Welcome to Your Dashboard! 🎉",
    description: "This is your financial command center. Get a complete overview of your finances at a glance.",
    position: "right",
  },
  {
    target: "[data-tour='total-assets']",
    title: "Total Assets 💰",
    description: "See the combined balance of all your active bank accounts. This is what you have in your possession.",
    position: "bottom",
  },
  {
    target: "[data-tour='total-liabilities']",
    title: "Total Liabilities 💳",
    description: "Track all your credit card balances and debts. Know exactly what you owe.",
    position: "bottom",
  },
  {
    target: "[data-tour='upcoming-expenses']",
    title: "Upcoming Expenses 📅",
    description: "Stay ahead of bills! See all expenses due in the next 30 days.",
    position: "bottom",
  },
  {
    target: "[data-tour='available-balance']",
    title: "Available After Liabilities ✨",
    description: "The magic number! This is your REAL spending power after accounting for all debts. Green means you're safe, red means you need to be careful.",
    position: "bottom",
  },
  {
    target: "[data-tour='sidebar-accounts']",
    title: "Manage Bank Accounts 🏦",
    description: "Add, edit, or deactivate your checking and savings accounts here.",
    position: "right",
  },
  {
    target: "[data-tour='sidebar-cards']",
    title: "Track Credit Cards 💳",
    description: "Monitor all your credit card balances and stay on top of your credit usage.",
    position: "right",
  },
  {
    target: "[data-tour='sidebar-income']",
    title: "Log Income Sources 💵",
    description: "Track your salary, freelance work, or any recurring income streams.",
    position: "right",
  },
  {
    target: "[data-tour='sidebar-expenses']",
    title: "Track Expenses 📊",
    description: "Add recurring bills like rent, utilities, subscriptions, and more.",
    position: "right",
  },
  {
    target: "[data-tour='search-bar']",
    title: "Quick Search ⌘K",
    description: "Press Cmd+K (or Ctrl+K) anytime to quickly search across your dashboard.",
    position: "bottom",
  },
];

export default function OnboardingTour() {
  const { isPinned } = useSidebar();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("onboardingCompleted");

    if (!hasCompletedOnboarding) {
      // Start tour after a short delay
      const timer = setTimeout(() => {
        setIsActive(true);
        updateHighlight(0);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      updateHighlight(currentStep);
    }
  }, [currentStep, isActive, isPinned]);

  const updateHighlight = (stepIndex: number) => {
    const step = tourSteps[stepIndex];
    const element = document.querySelector(step.target);

    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = 8;

      // Update highlight position
      setHighlightPosition({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Calculate tooltip position based on step position
      let tooltipTop = rect.top;
      let tooltipLeft = rect.left;

      switch (step.position) {
        case "bottom":
          tooltipTop = rect.bottom + 16;
          tooltipLeft = rect.left + rect.width / 2;
          break;
        case "top":
          tooltipTop = rect.top - 16;
          tooltipLeft = rect.left + rect.width / 2;
          break;
        case "right":
          tooltipTop = rect.top + rect.height / 2;
          tooltipLeft = rect.right + 16;
          break;
        case "left":
          tooltipTop = rect.top + rect.height / 2;
          tooltipLeft = rect.left - 16;
          break;
      }

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft });

      // Scroll element into view if needed
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const completeTour = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setIsActive(false);
  };

  if (!isActive) return null;

  const currentStepData = tourSteps[currentStep];

  return (
    <>
      {/* Backdrop Overlay - Reduced blur */}
      <div className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 backdrop-blur-[1px]" />

      {/* Clear cutout for highlighted element - no blur */}
      <div
        className="fixed z-[101] pointer-events-none transition-all duration-500 ease-out bg-base-200"
        style={{
          top: `${highlightPosition.top}px`,
          left: `${highlightPosition.left}px`,
          width: `${highlightPosition.width}px`,
          height: `${highlightPosition.height}px`,
        }}
      />

      {/* Animated Highlight Border */}
      <div
        className="fixed z-[102] pointer-events-none transition-all duration-500 ease-out"
        style={{
          top: `${highlightPosition.top}px`,
          left: `${highlightPosition.left}px`,
          width: `${highlightPosition.width}px`,
          height: `${highlightPosition.height}px`,
        }}
      >
        <div className="absolute inset-0 rounded-lg border-4 border-accent shadow-2xl animate-pulse" />
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[103] transition-all duration-500 ease-out"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform:
            currentStepData.position === "bottom"
              ? "translateX(-50%)"
              : currentStepData.position === "top"
              ? "translateX(-50%) translateY(-100%)"
              : currentStepData.position === "right"
              ? "translateY(-50%)"
              : "translateX(-100%) translateY(-50%)",
        }}
      >
        <div className="card bg-base-100 shadow-2xl max-w-sm border-2 border-accent/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="card-body p-6">
            {/* Step Counter */}
            <div className="flex items-center justify-between mb-3">
              <div className="badge badge-accent gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
                Step {currentStep + 1} of {tourSteps.length}
              </div>
              <button onClick={handleSkip} className="btn btn-ghost btn-xs">
                Skip Tour
              </button>
            </div>

            {/* Content */}
            <h3 className="card-title text-lg mb-2">{currentStepData.title}</h3>
            <p className="text-sm text-base-content/70 mb-4">{currentStepData.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="btn btn-sm btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>

              <div className="flex gap-1">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "w-6 bg-accent"
                        : index < currentStep
                        ? "w-2 bg-accent/50"
                        : "w-2 bg-base-content/20"
                    }`}
                  />
                ))}
              </div>

              <button onClick={handleNext} className="btn btn-sm btn-accent">
                {currentStep === tourSteps.length - 1 ? (
                  "Finish"
                ) : (
                  <>
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
