const Arrow = ({ extraStyle }: { extraStyle: string }) => {
  return (
    <svg
      className={`shrink-0 w-12 ${extraStyle}`}
      viewBox="0 0 138 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M72.9644 5.31431C98.8774 43.8211 83.3812 88.048 54.9567 120.735C54.4696 121.298 54.5274 122.151 55.0896 122.639C55.6518 123.126 56.5051 123.068 56.9922 122.506C86.2147 88.9044 101.84 43.3918 75.2003 3.80657C74.7866 3.18904 73.9486 3.02602 73.3287 3.44222C72.7113 3.85613 72.5484 4.69426 72.9644 5.31431Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M56.5084 121.007C56.9835 118.685 57.6119 115.777 57.6736 115.445C59.3456 106.446 59.5323 97.67 58.4433 88.5628C58.3558 87.8236 57.6824 87.2948 56.9433 87.3824C56.2042 87.4699 55.6756 88.1435 55.7631 88.8828C56.8219 97.7138 56.6432 106.225 55.0203 114.954C54.926 115.463 53.5093 121.999 53.3221 123.342C53.2427 123.893 53.3688 124.229 53.4061 124.305C53.5887 124.719 53.8782 124.911 54.1287 125.015C54.4123 125.13 54.9267 125.205 55.5376 124.926C56.1758 124.631 57.3434 123.699 57.6571 123.487C62.3995 120.309 67.4155 116.348 72.791 113.634C77.9171 111.045 83.3769 109.588 89.255 111.269C89.9704 111.475 90.7181 111.057 90.9235 110.342C91.1288 109.626 90.7117 108.878 89.9963 108.673C83.424 106.794 77.3049 108.33 71.5763 111.223C66.2328 113.922 61.2322 117.814 56.5084 121.007Z"
        />
      </g>
    </svg>
  );
};

// Problem Agitation: A crucial, yet overlooked, component for a landing page that sells.
// It goes under your Hero section, and above your Features section.
// Your Hero section makes a promise to the customer: "Our product will help you achieve XYZ".
// Your Problem section explains what happens to the customer if its problem isn't solved.
// The copy should NEVER mention your product. Instead, it should dig the emotional outcome of not fixing a problem.
// For instance:
// - Hero: "OneView shows your complete financial picture in one place"
// - Problem Agitation: "Your money is scattered everywhere, you're guessing what you can spend, and overdrafts happen" (not about OneView at all)
// - Features: "OneView connects all your accounts and shows your true available balance"
const Problem = () => {
  return (
    <section className="section-spacing bg-primary/5">
      <div className="container-primary text-center">
        <h2 className="max-w-3xl mx-auto font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight mb-4 md:mb-6">
          Your money is scattered. Your budget apps don&apos;t help.
        </h2>
        <p className="max-w-xl mx-auto text-base sm:text-lg text-base-content/70 leading-relaxed mb-12">
          Checking three apps just to know if you can afford dinner. Budgets that break when life happens.
          Bills you forgot about until they hit.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 max-w-4xl mx-auto">
          <div className="card-modern p-6 w-full md:w-48 flex flex-col gap-3 items-center justify-center hover:scale-105 transition-transform relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-white font-bold text-base flex items-center justify-center shadow-lg ring-2 ring-white z-10">
              1
            </div>
            <span className="text-4xl">{" 🏦"}</span>
            <h3 className="font-semibold text-sm">Money scattered across 5+ accounts</h3>
          </div>

          <Arrow extraStyle="max-md:-scale-x-100 md:-rotate-90 fill-[#6e56cf]" />

          <div className="card-modern p-6 w-full md:w-48 flex flex-col gap-3 items-center justify-center hover:scale-105 transition-transform relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-white font-bold text-base flex items-center justify-center shadow-lg ring-2 ring-white z-10">
              2
            </div>
            <span className="text-4xl">{"😰"}</span>
            <h3 className="font-semibold text-sm">Guess what you can spend</h3>
          </div>

          <Arrow extraStyle="md:-scale-x-100 md:-rotate-90 fill-[#6e56cf]" />

          <div className="card-modern p-6 w-full md:w-48 flex flex-col gap-3 items-center justify-center hover:scale-105 transition-transform relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-white font-bold text-base flex items-center justify-center shadow-lg ring-2 ring-white z-10">
              3
            </div>
            <span className="text-4xl">{"📉"}</span>
            <h3 className="font-semibold text-sm">Spend more than you can afford</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
