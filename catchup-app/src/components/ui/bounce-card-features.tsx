"use client";

import React from "react";
import { motion } from "framer-motion";

export const BouncyCardsFeatures = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 text-white bg-black">
      {/* Section Header */}
      <div className="mb-16 flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 text-emerald-500 text-xs font-semibold tracking-[0.2em] uppercase border border-emerald-500/20 bg-emerald-950/20 px-4 py-1.5 rounded-full">
          Features
        </span>
        <h2 className="text-4xl font-bold md:text-5xl tracking-tight leading-tight">
          Grow faster with our
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> all-in-one solution</span>
        </h2>
        <p className="text-gray-400 text-base leading-relaxed">
          CatchUp replaces spreadsheets, calendar reminders, and awkward follow-up emails with a seamless automated recovery pipeline.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-1 inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 font-semibold text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-sm"
        >
          Learn more
        </motion.button>
      </div>
      
      <div className="mb-4 grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-4">
          <CardTitle>Automated Follow-ups</CardTitle>
          <CardDescription>
            Set your follow-up delay, customize templates, and let CatchUp chase down unpaid invoices automatically.
          </CardDescription>
          <div className="absolute bottom-0 left-4 right-4 top-48 translate-y-8 rounded-t-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-emerald-50 text-xs tracking-wider">
              DRIP EMAIL PIPELINE
            </span>
          </div>
        </BounceCard>
        
        <BounceCard className="col-span-12 md:col-span-8">
          <CardTitle>1-Click Stripe Payments</CardTitle>
          <CardDescription>
            Generate custom, secure Stripe payment links directly from your dashboard and drop them into your automated reminder templates.
          </CardDescription>
          <div className="absolute bottom-0 left-4 right-4 top-48 translate-y-8 rounded-t-2xl bg-gradient-to-br from-teal-600 to-emerald-800 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-teal-50 text-xs tracking-wider">
              INSTANT CHECKOUT INTEGRATION
            </span>
          </div>
        </BounceCard>
      </div>
      
      <div className="grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-8">
          <CardTitle>AI Revenue Forecasting</CardTitle>
          <CardDescription>
            Know exactly how much money is sitting in your pipeline and get AI-driven predictions on expected monthly payouts and times.
          </CardDescription>
          <div className="absolute bottom-0 left-4 right-4 top-48 translate-y-8 rounded-t-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-emerald-50 text-xs tracking-wider">
              PREDICTIVE CASH FLOW ANALYTICS
            </span>
          </div>
        </BounceCard>
        
        <BounceCard className="col-span-12 md:col-span-4">
          <CardTitle>Smart Reminders</CardTitle>
          <CardDescription>
            Notify clients on their preferred channels when an invoice is due, ensuring prompt and clear communication.
          </CardDescription>
          <div className="absolute bottom-0 left-4 right-4 top-48 translate-y-8 rounded-t-2xl bg-gradient-to-br from-teal-700 to-emerald-900 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-teal-50 text-xs tracking-wider">
              MULTI-CHANNEL CLIENT NUDGES
            </span>
          </div>
        </BounceCard>
      </div>
    </section>
  );
};

const BounceCard = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.98, rotate: "-0.5deg" }}
      className={`group relative min-h-[320px] cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 p-8 transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{children}</h3>
  );
};

const CardDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-gray-400 text-sm leading-relaxed max-w-md">{children}</p>
  );
};
