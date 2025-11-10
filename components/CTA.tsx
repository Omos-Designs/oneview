import Image from "next/image";
import ButtonLead from "./ButtonLead";

const CTA = () => {
  return (
    <section className="relative overflow-hidden section-spacing-lg bg-gradient-to-br from-accent/10 via-accent/5 to-background">
      <Image
        src="/blurry-gradient.svg"
        alt="Background gradient"
        className="object-cover w-full opacity-20"
        fill
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container-primary text-center text-base-content">
        <div className="flex flex-col items-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/30 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Ready to Take Control?</span>
          </div>

          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 md:mb-8 leading-tight">
            Stop checking <span className="text-accent">five different accounts</span> just to know if you can afford a night out
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-base-content/70 mb-8 md:mb-12 leading-relaxed max-w-2xl">
            Join the waitlist today and be one of the first to experience <span className="font-semibold text-base-content">effortless financial clarity</span> with OneView.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <ButtonLead />
            <div className="flex items-center gap-2 text-sm text-base-content/60">
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
