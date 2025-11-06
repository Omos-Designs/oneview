import Link from "next/link";
import Image from "next/image";
import config from "@/config";

// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.resend.supportEmail, the link won't be displayed.

const Footer = () => {
  return (
    <footer className="bg-background-muted border-t border-border-subtle">
      <div className="container-primary py-16 md:py-20">
        <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col gap-12">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <Link
              href="/#"
              aria-current="page"
              className="flex gap-2 justify-center md:justify-start items-center"
            >
              <Image
                src="/oneview_logo.svg"
                alt={`${config.appName} logo`}
                priority={true}
                className="w-8 h-8"
                width={32}
                height={32}
              />
              <strong className="font-extrabold tracking-tight text-base md:text-lg">
                {config.appName}
              </strong>
            </Link>

            <p className="mt-4 text-sm text-base-content/70 leading-relaxed">
              {config.appDescription}
            </p>
            <p className="mt-4 text-xs text-base-content/50">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>
          <div className="flex-grow flex flex-wrap justify-center md:justify-end md:mt-0 mt-8 text-center gap-8 md:gap-12">
            <div className="md:text-left">
              <div className="font-semibold text-base-content text-xs uppercase tracking-wider mb-4">
                LINKS
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-3 text-sm">
                {config.resend.supportEmail && (
                  <a
                    href={`mailto:${config.resend.supportEmail}`}
                    target="_blank"
                    className="text-base-content/70 hover:text-accent transition-colors duration-200"
                    aria-label="Contact Support"
                  >
                    Support
                  </a>
                )}
                <Link href="/#features" className="text-base-content/70 hover:text-accent transition-colors duration-200">
                  Features
                </Link>
                <Link href="/#pricing" className="text-base-content/70 hover:text-accent transition-colors duration-200">
                  Pricing
                </Link>
                <Link href="/blog" className="text-base-content/70 hover:text-accent transition-colors duration-200">
                  Blog
                </Link>
                <Link href="/#faq" className="text-base-content/70 hover:text-accent transition-colors duration-200">
                  FAQ
                </Link>
              </div>
            </div>

            <div className="md:text-left">
              <div className="font-semibold text-base-content text-xs uppercase tracking-wider mb-4">
                LEGAL
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-3 text-sm">
                <Link href="/tos" className="text-base-content/70 hover:text-accent transition-colors duration-200">
                  Terms of services
                </Link>
                <Link href="/privacy-policy" className="text-base-content/70 hover:text-accent transition-colors duration-200">
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
