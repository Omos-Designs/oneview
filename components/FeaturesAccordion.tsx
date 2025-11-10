"use client";

import { useState, useRef } from "react";
import type { JSX } from "react";
import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  type?: "video" | "image";
  path?: string;
  format?: string;
  alt?: string;
  svg?: JSX.Element;
}

// The features array is a list of features that will be displayed in the accordion.
// - title: The title of the feature
// - description: The description of the feature (when clicked)
// - type: The type of media (video or image)
// - path: The path to the media (for better SEO, try to use a local path)
// - format: The format of the media (if type is 'video')
// - alt: The alt text of the image (if type is 'image')
const features = [
  {
    title: "Connect All Your Accounts",
    description:
      "OneView supports linking every bank account, credit card,  and investment account in seconds using Plaid. See your balances sync automatically—no more logging into 5 different apps to see your full financial picture.",
    type: "image",
    path: "/undraw_finance_m6vw.svg",
    alt: "Connect all your financial accounts",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
  },
  {
    title: "Manual Account Entry (if you want)!",
    description:
      "Want to keep you account information private? No problem. You can manually add your account balances and fixed expenses instead of linking your accounts. OneView will still calculate your available balance and forecast your finances based on the data you provide.",
    type: "image",
    path: "/undraw_spreadsheets_bh6n.svg",
    alt: "Manual data entry and spreadsheet management",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
  },
  {
    title: "See Your Financial Health at a Glance",
    description:
      "Instantly know if you're in the green or in the red with our color-coded health indicator. No spreadsheets, no math—just one number that shows exactly where you stand financially, right now.",
    type: "image",
    path: "/undraw_presentation_4ik4.svg",
    alt: "Visual financial health dashboard presentation",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    title: "Know What You Can Actually Spend",
    description:
      "We calculate your true \"available after liabilities\" balance by factoring in all your upcoming bills and expected income. No more surprise overdrafts or wondering if you can afford that purchase.",
    type: "image",
    path: "/undraw_personal-finance_xpqg.svg",
    alt: "Personal finance and spending calculation",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Track Recurring Income & Bills",
    description:
      "Add your paycheck schedule, rent, subscriptions, and other recurring events. OneView forecasts your financial position for the month ahead so you're never caught off guard by upcoming expenses.",
    type: "image",
    path: "/undraw_finance_m6vw.svg",
    alt: "Recurring income and bill tracking",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
        />
      </svg>
    ),
  },
  {
    title: "Plan Ahead with Forecasting",
    description:
      "See how your finances will look next week, next month, or next quarter. OneView projects your balance based on recurring events so you can make confident financial decisions today.",
    type: "image",
    path: "/undraw_presentation_4ik4.svg",
    alt: "Financial forecasting and projections",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
] as Feature[];

// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({
  feature,
  isOpen,
  setFeatureSelected,
}: {
  index: number;
  feature: Feature;
  isOpen: boolean;
  setFeatureSelected: () => void;
}) => {
  const accordion = useRef(null);
  const { title, description, svg } = feature;

  return (
    <li className={`accordion-item rounded-xl border transition-all duration-300 ${isOpen ? 'bg-accent/5 border-accent/30 ring-2 ring-accent/20 shadow-lg shadow-accent/10' : 'bg-background/50 backdrop-blur-sm border-border-subtle hover:bg-background-muted hover:border-accent/20 hover:shadow-md'}`}>
      <button
        className="relative flex gap-3 items-center w-full px-4 py-4 text-base font-medium text-left transition-colors"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span className={`duration-200 flex-shrink-0 ${isOpen ? "text-accent" : "text-base-content/60"}`}>
          {svg}
        </span>
        <span
          className={`flex-1 transition-colors duration-200 ${
            isOpen ? "text-accent font-semibold" : "text-base-content"
          }`}
        >
          <h3 className="inline">{title}</h3>
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : 'text-base-content/40'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-400 ease-in-out overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="px-4 pb-4 pt-1 leading-relaxed text-sm text-base-content/70">{description}</div>
      </div>
    </li>
  );
};

// A component to display the media (video or image) of the feature. If the type is not specified, it will display an empty div.
// Video are set to autoplay for best UX.
const Media = ({ feature }: { feature: Feature }) => {
  const { type, path, format, alt } = feature;
  const style = "rounded-2xl aspect-video w-full shadow-2xl hover:shadow-accent/20 transition-all duration-500 border border-border-subtle ring-1 ring-accent/10 hover:ring-accent/30 hover:scale-[1.02]";
  const size = {
    width: 800,
    height: 450,
  };

  if (type === "video") {
    return (
      <video
        className={style}
        autoPlay
        muted
        loop
        playsInline
        controls
        width={size.width}
        height={size.height}
      >
        <source src={path} type={format} />
      </video>
    );
  } else if (type === "image") {
    return (
      <div className="relative group">
        {/* Background glow effect - Purple accent color */}
        <div className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to right, rgba(110, 86, 207, 0.2), rgba(110, 86, 207, 0.1))' }}></div>

        {/* Main image with glass morphism effect */}
        <div className="relative">
          <Image
            src={path}
            alt={alt}
            className={`${style} object-contain bg-transparent`}
            width={size.width}
            height={size.height}
          />
        </div>
      </div>
    );
  } else {
    return <div className={`${style} bg-background-muted flex items-center justify-center`}>
      <span className="text-base-content/30 text-sm">Feature preview</span>
    </div>;
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState<number>(0);

  return (
    <section
      className="section-spacing"
      id="features"
    >
      <div className="container-primary">
        <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-12 md:mb-16 text-center">
          Everything you need to{" "}
          <span className="bg-accent text-white px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap inline-block">
            take control of your money
          </span>
        </h2>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <ul className="w-full">
              {features.map((feature, i) => (
                <Item
                  key={feature.title}
                  index={i}
                  feature={feature}
                  isOpen={featureSelected === i}
                  setFeatureSelected={() => setFeatureSelected(i)}
                />
              ))}
            </ul>

            <Media feature={features[featureSelected]} key={featureSelected} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
