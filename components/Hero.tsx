"use client";

import { useEffect, useState } from "react";
import TestimonialsAvatars from "./TestimonialsAvatars";
import ButtonLead from "./ButtonLead";

const Hero = () => {
  const [isScribbled, setIsScribbled] = useState(false);

  useEffect(() => {
    // Trigger scribble animation on mount
    const timer = setTimeout(() => setIsScribbled(true), 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="section-spacing-lg">
      <div className="container-primary flex flex-col gap-8 items-center justify-center text-center max-w-4xl">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight md:-mb-4">
          <span className="relative inline-block">
            <span className="relative z-10">One</span>
            <svg
              className={`absolute -bottom-2 left-0 w-full h-3 ${
                isScribbled ? "animate-scribble" : "opacity-0"
              }`}
              viewBox="0 0 120 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10C20 3 40 1 60 5C80 9 100 7 118 10"
                stroke="#6e56cf"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="200"
                strokeDashoffset={isScribbled ? "0" : "200"}
                style={{
                  transition: "stroke-dashoffset 1.5s ease-in-out",
                }}
              />
            </svg>
          </span>{" "}
          single{" "}
          <span className="relative inline-block">
            <span className="relative z-10">view</span>
            <svg
              className={`absolute -bottom-2 left-0 w-full h-3 ${
                isScribbled ? "animate-scribble" : "opacity-0"
              }`}
              viewBox="0 0 120 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10C20 3 40 1 60 5C80 9 100 7 118 10"
                stroke="#6e56cf"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="200"
                strokeDashoffset={isScribbled ? "0" : "200"}
                style={{
                  transition: "stroke-dashoffset 1.5s ease-in-out 0.3s",
                }}
              />
            </svg>
          </span>{" "}
          for all your financials
        </h1>

        <p className="text-lg opacity-80 leading-relaxed">
          Stop guessing what you can spend. OneView shows your true financial picture—every account,
          every dollar—all in one place. Know exactly what you owe, so you know what you can spend throughout the month.
        </p>

        {/* <button className="btn btn-gradient btn-wide">
          Join the Waitlist
        </button> */}
        <ButtonLead />

        <TestimonialsAvatars priority={true} />

        {/* Browser mockup section - to be added below hero */}
        <div className="container-primary mt-16 w-full">
          <div className="rounded-xl border border-border-subtle bg-gradient-to-b from-background-muted to-background p-1 shadow-xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 rounded-t-lg bg-background-subtle px-4 py-3 border-b border-border-subtle">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 ml-4">
                <div className="bg-background rounded px-3 py-1 text-xs text-base-content/50 max-w-md">
                  one-view.app/dashboard
                </div>
              </div>
            </div>
            {/* Browser content - placeholder for now */}
            <div className="bg-background-muted rounded-b-lg aspect-video flex items-center justify-center">
              <p className="text-base-content/40 text-sm">Dashboard preview coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
