import React from "react";
import { motion } from "motion/react";

type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm shadow-lg shadow-black/40 hover:border-emerald-500/30 transition-colors duration-300 max-w-xs w-full"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-emerald-400 fill-emerald-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">"{text}"</p>

                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-zinc-800">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-sm tracking-tight leading-5">{name}</span>
                    <span className="text-xs text-gray-500 leading-5">{role}</span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};

const testimonials: Testimonial[] = [
  {
    text: "CatchUp recovered $12,000 in outstanding invoices in my first month. I stopped chasing clients manually and my cash flow has never been healthier.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Sophia Patel",
    role: "Freelance Designer",
  },
  {
    text: "The automated follow-ups sound so professional that clients actually thank me for the reminders. Payments come in 3x faster now.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Aarav Mehta",
    role: "Agency Founder",
  },
  {
    text: "Setting up a Stripe payment link inside a reminder template is genius. My clients pay within minutes of getting the nudge.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
    name: "David Liu",
    role: "Freelance Consultant",
  },
  {
    text: "I used to spend 5 hours a week writing follow-up emails. CatchUp does it all automatically and gets better results than I ever did.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Aliza Khan",
    role: "Brand Strategist",
  },
  {
    text: "The AI revenue forecast told me exactly how much I'd collect that month. I finally feel in control of my business finances.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80",
    name: "James Carter",
    role: "Web Developer",
  },
  {
    text: "My late payment rate dropped from 60% to under 10% in 6 weeks. CatchUp is the single best tool I've added to my freelance stack.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Zara Ahmed",
    role: "Content Creator",
  },
  {
    text: "Our ops team saves 10+ hours a week on follow-ups. The dashboard gives us a crystal-clear view of everything that's outstanding.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Omar Raza",
    role: "Operations Manager",
  },
  {
    text: "CatchUp's templates sound human. Clients don't feel spammed — they actually respond and pay. Incredible product.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Priya Sharma",
    role: "UX Consultant",
  },
  {
    text: "Onboarding took under 10 minutes. By end of day I had automated reminders running and two invoices paid that had been overdue for weeks.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Lucas Moreau",
    role: "Motion Designer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-black py-24 relative overflow-hidden" id="reviews">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[800px] rounded-full bg-emerald-500/5 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-emerald-500 text-xs font-semibold tracking-[0.2em] uppercase border border-emerald-500/20 bg-emerald-950/20 px-4 py-1.5 rounded-full mb-5">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl leading-tight mb-4">
            What our users say
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Freelancers and teams use CatchUp to recover revenue on autopilot —
            here's what they think.
          </p>
        </motion.div>

        {/* Scrolling columns */}
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
