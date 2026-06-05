import React, { useEffect, useState } from "react";
import { Monitor, LayoutDashboard, Users } from "lucide-react";
import CountUp from "react-countup";

const CountUpComponent = (CountUp as any).default || CountUp;

/** Hook: respects user's motion preferences */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** Utility: parse a metric like "98%", "3.8x", "$1,200+", "1.5M", "€23.4k" */
function parseMetricValue(raw: string) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(
    /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/
  );
  if (!m) {
    return { prefix: "", end: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = normalized.split(".")[1]?.length ?? 0;
  return {
    prefix: prefix ?? "",
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? "",
    decimals,
  };
}

/** One animated metric stat */
function MetricStat({
  value,
  label,
  sub,
  duration = 1.6,
}: {
  value: string;
  label: string;
  sub?: string;
  duration?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 p-6">
      <p
        className="text-3xl font-bold text-white sm:text-4xl"
        aria-label={`${label} ${value}`}
      >
        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          {prefix}
          {reduceMotion ? (
            <span>
              {end.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              })}
            </span>
          ) : (
            <CountUpComponent
              end={end}
              decimals={decimals}
              duration={duration}
              separator=","
              enableScrollSpy
              scrollSpyOnce
            />
          )}
          {suffix}
        </span>
      </p>
      <p className="font-semibold text-white text-sm">{label}</p>
      {sub ? <p className="text-gray-400 text-xs">{sub}</p> : null}
    </div>
  );
}

export default function Casestudies() {
  const caseStudies = [
    {
      id: 1,
      title: "Automated Recovery at Scale",
      quote:
        "With CatchUp, our design agency finally recovered $15,000 in unpaid invoices within the first month. Follow-ups are automatic, and clients pay instantly with the Stripe link.",
      name: "Aarav Mehta",
      role: "Agency Founder",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80",
      icon: Monitor,
      metrics: [
        { value: "98%", label: "Recovery Rate", sub: "Of outstanding invoices" },
        { value: "40%", label: "Cash Flow Boost", sub: "In the first 30 days" },
      ],
    },
    {
      id: 2,
      title: "Unified Invoicing Pipeline",
      quote:
        "CatchUp gave our finance team a single view of everything outstanding. We saved 10+ hours a week and eliminated the awkward 'just checking in' emails entirely.",
      name: "Sophia Patel",
      role: "Operations Manager",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=500&q=80",
      icon: LayoutDashboard,
      metrics: [
        { value: "10h", label: "Hours Saved / wk", sub: "On manual follow-ups" },
        { value: "3.5x", label: "Faster Payouts", sub: "Vs traditional billing" },
      ],
    },
    {
      id: 3,
      title: "1-Click Stripe Payments",
      quote:
        "The Stripe integration is a game-changer. I drop a payment link into every automated nudge, and clients settle invoices within minutes — no back-and-forth.",
      name: "David Liu",
      role: "Freelance Consultant",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=500&q=80",
      icon: Users,
      metrics: [
        { value: "2.5x", label: "Faster Settlement", sub: "On outstanding balances" },
        { value: "92%", label: "Less Stress", sub: "Reported by freelancers" },
      ],
    },
  ];

  return (
    <section
      className="py-32 bg-black text-white"
      aria-labelledby="case-studies-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-5 text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center justify-center gap-2 text-emerald-500 text-xs font-semibold tracking-[0.2em] uppercase border border-emerald-500/20 bg-emerald-950/20 px-4 py-1.5 rounded-full w-fit mx-auto">
            Case Studies
          </span>
          <h2
            id="case-studies-heading"
            className="text-4xl font-bold md:text-5xl tracking-tight leading-tight"
          >
            Real results with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              CatchUp
            </span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            From solo freelancers to ops teams — CatchUp users recover more
            revenue, save hours every week, and never chase invoices manually again.
          </p>
        </div>

        {/* Case study rows */}
        <div className="flex flex-col gap-0">
          {caseStudies.map((study, idx) => {
            const reversed = idx % 2 === 1;
            const Icon = study.icon;
            return (
              <div
                key={study.id}
                className="grid gap-12 lg:grid-cols-3 xl:gap-20 items-center border-t border-zinc-800 py-16"
              >
                {/* Image + Quote block — spans 2 cols */}
                <div
                  className={[
                    "flex flex-col sm:flex-row gap-8 lg:col-span-2 text-left",
                    reversed
                      ? "lg:order-2 lg:border-l lg:border-zinc-800 lg:pl-12 xl:pl-16"
                      : "lg:border-r lg:border-zinc-800 lg:pr-12 xl:pr-16",
                  ].join(" ")}
                >
                  {/* Photo */}
                  <img
                    src={study.image}
                    alt={`${study.name} portrait`}
                    width={300}
                    height={400}
                    className="aspect-[4/5] h-auto w-full max-w-[180px] rounded-2xl object-cover ring-1 ring-emerald-500/20 hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/40 flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Quote block */}
                  <figure className="flex flex-col justify-between gap-6">
                    {/* Icon tag */}
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold uppercase tracking-widest">
                      <Icon className="w-4 h-4" />
                      <span>{study.title}</span>
                    </div>

                    <blockquote>
                      <p className="text-base sm:text-lg text-gray-300 leading-relaxed italic">
                        "{study.quote}"
                      </p>
                    </blockquote>

                    <figcaption className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                        {study.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{study.name}</p>
                        <p className="text-xs text-gray-500">{study.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </div>

                {/* Metrics block — 1 col */}
                <div
                  className={[
                    "flex flex-col gap-4 self-center",
                    reversed ? "lg:order-1" : "",
                  ].join(" ")}
                >
                  {study.metrics.map((metric, i) => (
                    <MetricStat
                      key={`${study.id}-${i}`}
                      value={metric.value}
                      label={metric.label}
                      sub={metric.sub}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
