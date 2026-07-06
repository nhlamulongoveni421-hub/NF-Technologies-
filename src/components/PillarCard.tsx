import React from 'react';
import { motion } from 'motion/react';
import { Check, Info, Server, HelpCircle, AlertCircle } from 'lucide-react';
import { Pillar } from '../types';

interface PillarCardProps {
  key?: React.Key;
  pillar: Pillar;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

export default function PillarCard({ pillar, isSelected, onToggle, index }: PillarCardProps) {
  // Format currency
  const formatRand = (num: number) => `R${num.toLocaleString('en-ZA')}`;

  return (
    <motion.div
      id={`pillar-card-${pillar.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 bg-white ${
        isSelected
          ? 'border-cyan-500 shadow-[0_8px_30px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/20'
          : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Pillar Badge */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded-md bg-white/95 text-cyan-600 border border-zinc-200 uppercase shadow-sm">
        Pillar {pillar.id}
      </div>

      {/* Select Toggle Top Corner */}
      <button
        id={`pillar-toggle-btn-${pillar.id}`}
        onClick={onToggle}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full border transition-all cursor-pointer ${
          isSelected
            ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_2px_8px_rgba(6,182,212,0.3)]'
            : 'bg-white/90 text-zinc-400 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
        }`}
        title={isSelected ? "Remove from Bundle" : "Add to Bundle"}
      >
        <Check className={`w-4 h-4 transition-transform ${isSelected ? 'scale-110 stroke-[3]' : 'scale-90 opacity-60'}`} />
      </button>

      {/* Image container with nice aspect ratio and dark overlay */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={pillar.imageUrl}
          alt={pillar.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
        
        {/* Cost overlay inside image area */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-300 font-mono">Setup Fee</span>
            <p className="text-xl font-black text-white leading-none">{formatRand(pillar.setupFee)}</p>
          </div>
          {pillar.hasMonthly && (
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-zinc-300 font-mono">Monthly</span>
              <p className="text-xl font-black text-cyan-400 leading-none">{formatRand(pillar.monthlyFee)}<span className="text-xs font-normal text-zinc-200 font-sans">/mo</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between bg-white text-zinc-800">
        <div>
          <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight mb-2 flex items-center gap-2">
            {pillar.title}
          </h3>
          
          <p className="text-sm text-zinc-650 mb-4 leading-relaxed line-clamp-3">
            {pillar.description}
          </p>

          {/* Quick Angle Callout */}
          <div className="mb-4 p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 font-bold block">The Angle</span>
              <p className="text-xs text-zinc-700 italic">"{pillar.angle}"</p>
            </div>
          </div>

          {/* Included Services List */}
          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-2">Services & Features</span>
            <ul className="space-y-2">
              {pillar.services.map((service, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-zinc-650">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Custom SaaS / App Ideas Accordion if present */}
        <div>
          {pillar.ideas && pillar.ideas.length > 0 && (
            <div className="mt-2 pt-3 border-t border-zinc-150">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 font-bold flex items-center gap-1 mb-2">
                <Server className="w-3 h-3" /> Asset Monetization Ideas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {pillar.ideas.map((idea, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 transition-colors"
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Button */}
          <button
            id={`pillar-action-btn-${pillar.id}`}
            onClick={onToggle}
            className={`w-full mt-4 py-2.5 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
              isSelected
                ? 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            {isSelected ? '✓ Added to Custom Empire' : '+ Add to Empire Bundle'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
