import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Target, Flag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { RoadmapPhase } from '../types';

export default function Roadmap() {
  const [activePhase, setActivePhase] = useState<number>(1);

  const phases: RoadmapPhase[] = [
    {
      phase: 1,
      title: "Foundation",
      timeline: "Months 1–3",
      focus: "Branding + Website + Google Business Profile",
      goal: "Land first 5–10 clients, establish core portfolio, prove reliable delivery operations.",
      milestones: [
        "Create brand identity, logos, and high-converting company profile decks.",
        "Launch modern, fast, mobile-friendly client websites paired with basic CMS.",
        "Optimize Google Business Profiles to dominate local map searches.",
        "Secure first 5 reference clients at standard setup fees."
      ]
    },
    {
      phase: 2,
      title: "Recurring Engine",
      timeline: "Months 3–6",
      focus: "Convert Phase 1 clients into monthly subscribers",
      goal: "Secure predictable, monthly recurring income to offset operational costs before scaling.",
      milestones: [
        "Onboard Phase 1 clients onto Website Maintenance agreements (R300/mo).",
        "Introduce WhatsApp Automation and Lead-Gen Chatbots (R1,500 setup + monitoring).",
        "Deploy basic AI customer support agents for 24/7 lead capture.",
        "Secure R10,000 in baseline Monthly Recurring Revenue (MRR)."
      ]
    },
    {
      phase: 3,
      title: "High-Ticket Add-ons",
      timeline: "Months 6–12",
      focus: "Cybersecurity & Full-Suite Digital Marketing",
      goal: "Leverage established client relationships & trust to sell high-margin protective and growth services.",
      milestones: [
        "Audit existing clients' digital infrastructure & secure with Cybersecurity monitoring.",
        "Upsell Lead Gen pipelines via Google Ads, SEO, and paid social campaigns.",
        "Deploy comprehensive backup, cloud recovery, and phishing awareness plans.",
        "Scale average account value per client to over R6,000/mo."
      ]
    },
    {
      phase: 4,
      title: "Scale & Own Assets",
      timeline: "Year 2+",
      focus: "SaaS Products, Custom Apps & E-Commerce",
      goal: "Transition from active time-for-money agency work to high-valuation, self-sustained recurring digital assets.",
      milestones: [
        "Architect and launch proprietary SaaS (e.g. AI Booking CRM, Restaurant Ordering).",
        "Publish standalone mobile apps for iOS/Android stores to earn passive ad/subscription cash flow.",
        "Establish automated e-commerce stores utilizing dropshipping or digital products.",
        "Achieve complete financial independence with zero dependency on hourly services."
      ]
    }
  ];

  return (
    <div id="roadmap-section" className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs uppercase font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Growth Strategy</span>
        </div>
        <h2 className="text-3xl font-black text-slate-100 tracking-tight">
          Phased Agency Roadmap
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          From a foundational launch to a self-sustaining asset empire. Click through the phases to explore milestones and core focuses.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 max-w-4xl mx-auto bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
        {phases.map((p) => {
          const isActive = activePhase === p.phase;
          const isCompleted = activePhase > p.phase;
          return (
            <button
              id={`roadmap-phase-tab-${p.phase}`}
              key={p.phase}
              onClick={() => setActivePhase(p.phase)}
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_4px_20px_rgba(6,182,212,0.2)]'
                  : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border ${
                  isActive
                    ? 'bg-slate-950 text-cyan-400 border-cyan-400/50'
                    : isCompleted
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : `0${p.phase}`}
              </div>
              <div className="min-w-0">
                <span className={`block text-[10px] font-mono uppercase tracking-wider ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  Phase 0{p.phase}
                </span>
                <span className="block text-sm font-black truncate">{p.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Phase Details Card */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          id={`roadmap-phase-panel-${activePhase}`}
          key={activePhase}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden"
        >
          {/* Subtle neon glowing accent */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* Left Col: Phase Overview */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  {phases[activePhase - 1].timeline}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                  Phase {activePhase}: {phases[activePhase - 1].title}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">Core Service Focus</span>
                <p className="text-sm font-bold text-slate-200 leading-relaxed">
                  {phases[activePhase - 1].focus}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-bold">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Strategic Objective</span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {phases[activePhase - 1].goal}
                </p>
              </div>
            </div>

            {/* Right Col: Milestone Checklist */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                Execution Blueprint & Milestones
              </span>

              <div className="space-y-3">
                {phases[activePhase - 1].milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/20 border border-slate-850 hover:border-slate-800 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Flag className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {milestone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
