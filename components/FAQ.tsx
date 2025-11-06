"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "Is my financial data secure?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          Absolutely. OneView uses Plaid, a trusted financial technology platform used by thousands of apps including Venmo, Coinbase, and Robinhood. All data is encrypted with 256-bit encryption (the same security banks use), and we never see your login credentials.
        </p>
        <p>
          Your data is stored securely and we never sell or share your information with third parties. You&apos;re always in control.
        </p>
      </div>
    ),
  },
  {
    question: "Which banks are supported?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          OneView supports over 10,000+ financial institutions through Plaid, including all major banks like Chase, Bank of America, Wells Fargo, Citi, and more. We also support credit unions, investment accounts (Fidelity, Vanguard, Charles Schwab), and credit cards from all major issuers.
        </p>
        <p>
          If your institution supports online banking, chances are it works with OneView.
        </p>
      </div>
    ),
  },
  {
    question: "Do you store my bank credentials?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          No, never. When you connect an account, you log in directly through Plaid&apos;s secure interface—not through OneView. Your username and password go directly to Plaid and your bank. We never see, store, or have access to your login credentials.
        </p>
        <p>
          Plaid generates a secure token that allows OneView to fetch your account balances without ever accessing your credentials.
        </p>
      </div>
    ),
  },
  {
    question: "Can I use it on mobile?",
    answer: (
      <p>
        Yes! OneView is fully responsive and works beautifully on phones, tablets, and desktops. You can check your financial health anywhere, anytime. We&apos;re also working on dedicated iOS and Android apps—join the waitlist to be the first to know when they launch!
      </p>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className={`accordion-item rounded-lg border transition-all duration-300 ${isOpen ? 'bg-accent/5 border-accent/30 ring-1 ring-accent/20' : 'bg-background border-border-subtle hover:bg-background-muted'}`}>
      <button
        className="relative flex gap-3 items-center w-full px-4 py-4 text-base font-medium text-left"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 transition-colors duration-200 ${isOpen ? "text-accent font-semibold" : "text-base-content"}`}
        >
          {item?.question}
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
        <div className="px-4 pb-4 pt-1 leading-relaxed text-sm text-base-content/70">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="section-spacing" id="faq">
      <div className="container-narrow flex flex-col md:flex-row gap-12 md:gap-16">
        <div className="flex flex-col text-left md:basis-2/5">
          <p className="inline-block font-semibold text-sm text-accent mb-3 uppercase tracking-wider">FAQ</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="md:basis-3/5 space-y-3">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
