"use client";

import Image from "next/image";
import { useState } from "react";

interface CompanyLogoProps {
  name: string;
  size?: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export default function CompanyLogo({
  name,
  size = 32,
  className = "",
  fallbackIcon
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);
  const LOGO_DEV_PUBLIC_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY;

  // If no API key or error loading, show fallback
  if (!LOGO_DEV_PUBLIC_KEY || hasError) {
    return (
      <div className={`w-${size/4} h-${size/4} rounded-full bg-base-content/10 flex items-center justify-center ${className}`}>
        {fallbackIcon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-base-content/40"
          >
            <path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25v9c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125v-9H1z" />
          </svg>
        )}
      </div>
    );
  }

  // Extract domain from company name (e.g., "Chase Checking" -> "chase")
  const getDomainFromName = (companyName: string) => {
    // Common bank/company name to domain mappings
    const domainMap: { [key: string]: string } = {
      // Credit Cards & Banks
      'chase': 'chase.com',
      'ally': 'ally.com',
      'capital one': 'capitalone.com',
      'capitalone': 'capitalone.com',
      'american express': 'americanexpress.com',
      'amex': 'americanexpress.com',
      'wells fargo': 'wellsfargo.com',
      'wellsfargo': 'wellsfargo.com',
      'bank of america': 'bankofamerica.com',
      'bankofamerica': 'bankofamerica.com',
      'citi': 'citi.com',
      'citibank': 'citi.com',
      'discover': 'discover.com',
      'usaa': 'usaa.com',
      'usbank': 'usbank.com',
      'us bank': 'usbank.com',
      'barclays': 'barclays.com',
      'synchrony': 'synchronybank.com',
      'pnc': 'pnc.com',
      'pnc bank': 'pnc.com',
      'td': 'td.com',
      'td bank': 'td.com',
      'navyfederal': 'navyfederal.org',
      'navy federal': 'navyfederal.org',
      'regions': 'regions.com',
      'regions bank': 'regions.com',
      'citizens': 'citizensbank.com',
      'citizens bank': 'citizensbank.com',
      'marcus': 'marcus.com',
      'marcus by goldman sachs': 'marcus.com',
      'other': 'generic', // Generic fallback
      // Subscriptions & Services
      'netflix': 'netflix.com',
      'spotify': 'spotify.com',
      'amazon': 'amazon.com',
      'disney': 'disneyplus.com',
      'hulu': 'hulu.com',
      'apple': 'apple.com',
      'google': 'google.com',
      'microsoft': 'microsoft.com',
      'verizon': 'verizon.com',
      'att': 'att.com',
      't-mobile': 't-mobile.com',
      'comcast': 'xfinity.com',
      'xfinity': 'xfinity.com',
    };

    const lowerName = companyName.toLowerCase();

    // Check if any known company name is in the string
    for (const [key, domain] of Object.entries(domainMap)) {
      if (lowerName.includes(key)) {
        return domain;
      }
    }

    // Default: try to use first word as domain
    const firstWord = companyName.split(' ')[0].toLowerCase();
    return `${firstWord}.com`;
  };

  const domain = getDomainFromName(name);
  const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}&size=${size}&format=png`;

  return (
    <div className={`w-${size/4} h-${size/4} rounded-full overflow-hidden bg-white flex items-center justify-center ${className}`} style={{ width: `${size}px`, height: `${size}px` }}>
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="object-contain"
        onError={() => setHasError(true)}
        unoptimized // Logo.dev URLs are already optimized
      />
    </div>
  );
}
