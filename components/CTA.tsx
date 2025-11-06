import Image from "next/image";
import ButtonLead from "./ButtonLead";

const CTA = () => {
  return (
    <section className="relative overflow-hidden section-spacing-lg bg-accent/5">
      <Image
        src="/blurry-gradient.svg"
        alt="Background gradient"
        className="object-cover w-full opacity-20"
        fill
      />
      <div className="relative container-primary text-center text-base-content">
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          <h2 className="font-bold text-2xl sm:text-2xl md:text-4xl lg:text-4xl tracking-tight mb-6 md:mb-8">
            Stop checking five different accounts just to know if you can afford a night out. 
          </h2>
          <p className="text-base sm:text-lg text-base-content/70 mb-8 md:mb-12 leading-relaxed">
            Join the waitlist today and be one of the first to experience effortless financial clarity with OneView.
          </p>

          <ButtonLead />
        </div>
      </div>
    </section>
  );
};

export default CTA;
