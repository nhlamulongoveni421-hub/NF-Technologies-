import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap
} from 'lucide-react';
import { Pillar } from '../types';

interface BundleBuilderProps {
  pillars: Pillar[];
  selectedIds: number[];
  onTogglePillar: (id: number) => void;
  onOpenProposal: () => void;
}

export default function BundleBuilder({ 
  pillars, 
  selectedIds, 
  onTogglePillar, 
  onOpenProposal 
}: BundleBuilderProps) {
  
  // Format currency
  const formatRand = (num: number) => `R${num.toLocaleString('en-ZA')}`;

  const selectedPillars = pillars.filter(p => selectedIds.includes(p.id));
  
  // Calculations
  const totalSetup = selectedPillars.reduce((acc, p) => acc + p.setupFee, 0);
  const totalMonthly = selectedPillars.reduce((acc, p) => acc + (p.hasMonthly ? p.monthlyFee : 0), 0);

  return (
    <div id="bundle-builder-section" className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] text-zinc-800">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Selection Summary */}
        <div className="flex-1 space-y-6 text-left">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-600" />
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">Interactive Package Configuration</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight font-display">
              Build Your Digital Empire Package
            </h2>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
              Select or remove service pillars above to dynamically configure your custom business package. Ready to launch? Generate your custom official proposal below.
            </p>
          </div>

          {/* Active Package Components List */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-450 font-bold block mb-3">Selected Package Layers</span>
            
            {selectedPillars.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-zinc-200 rounded-xl bg-white">
                <p className="text-xs text-zinc-500 italic">No pillars selected. Click '+ Add to Empire Bundle' on the service pillars above to begin building your package.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans">
                <AnimatePresence>
                  {selectedPillars.map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-zinc-200 hover:border-cyan-500 transition-all text-xs text-zinc-800"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                        <span className="text-zinc-800 font-medium truncate">{p.title}</span>
                      </div>
                      <button
                        onClick={() => onTogglePillar(p.id)}
                        className="text-[10px] font-mono text-zinc-400 hover:text-cyan-600 px-1.5 py-0.5 rounded transition-colors cursor-pointer font-bold uppercase"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Branding slogan / reassurance */}
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-900 font-display">The NF Technologies Value Model</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All monthly subscription modules guarantee high uptime, complete maintenance, premium speed, monthly SEO health checks, and direct technical updates so you never fall behind.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Summary Output (Priced details) */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col justify-between bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6 text-left">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-600 font-black">Client Cost Structure</span>
              <p className="text-xs text-zinc-500">Corporate Account Package pricing</p>
            </div>

            {/* Base client summary */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border border-zinc-200 flex justify-between items-center shadow-sm">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">One-Off Setup Fee</span>
                  <span className="text-[10px] text-zinc-400 leading-none">Implementation & design</span>
                </div>
                <p className="text-2xl font-extrabold text-zinc-900 font-mono">{formatRand(totalSetup)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-cyan-500/20 flex justify-between items-center shadow-sm shadow-[0_2px_10px_rgba(6,182,212,0.04)]">
                <div>
                  <span className="text-[10px] font-mono text-cyan-600 uppercase block tracking-wider font-bold">Monthly Subscription</span>
                  <span className="text-[10px] text-zinc-400 leading-none">Cloud hosting, 24/7 SLA</span>
                </div>
                <p className="text-2xl font-extrabold text-cyan-600 font-mono">{formatRand(totalMonthly)}</p>
              </div>
            </div>

            <div className="h-[1px] bg-zinc-200" />

            {/* Pro tip / Quote block */}
            <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex gap-2.5 items-start">
              <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-650 leading-normal">
                <strong>Corporate Guarantee:</strong> Setup fees cover our direct asset creation and system configuration, while recurring monthly subscriptions protect your digital ecosystem with continuous optimization.
              </p>
            </div>
          </div>

          <button
            id="proposal-builder-trigger-btn"
            onClick={onOpenProposal}
            disabled={selectedIds.length === 0}
            className={`w-full mt-6 py-4 px-6 rounded-xl font-mono text-xs font-bold tracking-wider uppercase border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              selectedIds.length === 0
                ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                : 'bg-cyan-500 text-white border-cyan-400 hover:bg-cyan-400 hover:shadow-[0_4px_12px_rgba(6,182,212,0.3)] shadow-md'
            }`}
          >
            <span>Inquire & Request Proposal</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

      </div>
    </div>
  );
}
