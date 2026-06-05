import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormBuilderHeroProps {
  illustrationSrc?: string;
  illustrationAlt?: string;
  title: React.ReactNode;
  description: string;
  buttonText: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

export const FormBuilderHero: React.FC<FormBuilderHeroProps> = ({
  illustrationSrc,
  illustrationAlt = "Hero Illustration",
  title,
  description,
  buttonText,
  buttonHref = "#",
  onButtonClick,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.18 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  return (
    <div className="relative flex w-full items-center justify-center bg-black px-6 py-28 md:py-40 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[700px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Top border line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <motion.div
        className="relative mx-auto flex max-w-2xl flex-col items-center text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Optional illustration */}
        {illustrationSrc && (
          <motion.div variants={itemVariants} className="mb-8">
            <img
              src={illustrationSrc}
              alt={illustrationAlt}
              className="h-auto w-48 select-none opacity-90"
            />
          </motion.div>
        )}

        {/* Eyebrow badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 text-emerald-500 text-xs font-semibold tracking-[0.2em] uppercase border border-emerald-500/20 bg-emerald-950/20 px-4 py-1.5 rounded-full mb-6">
            Get Started Free
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-tight"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-10 max-w-lg text-base text-gray-400 md:text-lg leading-relaxed"
        >
          {description}
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            size="lg"
            className="group px-8 py-3 text-base"
            onClick={onButtonClick}
            asChild={!onButtonClick}
          >
            {onButtonClick ? (
              <span className="flex items-center gap-2">
                {buttonText}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            ) : (
              <a href={buttonHref} className="flex items-center gap-2">
                {buttonText}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            )}
          </Button>
          <p className="text-xs text-gray-600">No credit card required</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
