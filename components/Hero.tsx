"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <section className="section-spacing-lg relative overflow-hidden">
      {/* Background gradient blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 blur-3xl rounded-full"></div>
      </div>

      <div className="container-primary flex flex-col gap-8 items-center justify-center text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/20">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Financial Clarity Made Simple</span>
        </div>

        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text">One</span>
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
          <span className="text-base-content/90">single</span>{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-accent">view</span>
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
          </span>
          <br />
          <span className="text-base-content/90">for all your financials</span>
        </h1>

        <p className="text-lg md:text-xl text-base-content/70 leading-relaxed max-w-2xl">
          Stop guessing what you can spend. OneView shows your true financial picture—every account,
          every dollar—all in one place. <span className="font-semibold text-base-content/90">Know exactly what you owe, so you know what you can spend</span> throughout the month.
        </p>

        <div className="flex flex-col gap-4 items-center justify-center w-full sm:w-auto" id="waitlist">
          <ButtonLead />
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <Link
              href="/demo-dashboard"
              className="btn btn-accent btn-wide text-base gap-2 group"
            >
              View Demo
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <a
              href="#features"
              className="btn btn-ghost btn-wide text-base gap-2 group"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

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
            {/* Browser content - dashboard screenshot */}
            <div className="bg-background-muted rounded-b-lg overflow-hidden">
              <Image
                src="/oneview-demo-dashboard.png"
                alt="OneView Dashboard Preview"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
