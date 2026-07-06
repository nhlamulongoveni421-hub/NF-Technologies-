import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Heart, Globe, GraduationCap, Award, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateToServices: () => void;
}

export default function AboutPage({ onNavigateToServices }: AboutPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-5xl mx-auto bg-white border border-zinc-200/80 rounded-3xl shadow-md overflow-hidden flex flex-col text-zinc-800"
    >
      {/* Sticky or top Page Header */}
      <div className="bg-zinc-50 px-6 md:px-8 py-5 border-b border-zinc-200 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-cyan-600" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">Our Story & Vision</span>
        </div>
        <button
          onClick={onNavigateToServices}
          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-zinc-500 hover:text-cyan-600 transition-colors cursor-pointer"
        >
          <span>Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 md:p-10 space-y-10 relative overflow-hidden">
        {/* Ambient Glow background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Premium Tech Wave & Dot Grid background exactly matching a light high-tech aesthetic */}
        <div className="absolute inset-0 pointer-events-none opacity-40 select-none z-0">
          <svg className="absolute w-full h-full min-w-[700px] top-0 left-0" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="page-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#0891b2" opacity="0.1" />
              </pattern>
              <linearGradient id="pageWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="pageWave2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#0891b2" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="pageLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#page-dot-grid)" />
            <path d="M-100,600 C200,720 400,450 700,680 C850,750 950,650 1100,600 L1100,800 L-100,800 Z" fill="url(#pageWave1)" />
            <path d="M-100,550 C150,600 350,520 650,580 C800,610 900,500 1100,550 L1100,800 L-100,800 Z" fill="url(#pageWave2)" />
            <path d="M-100,550 C150,600 350,520 650,580 C800,610 900,500 1100,550" stroke="url(#pageLineGrad)" strokeWidth="2" strokeLinecap="round" />
            <path d="M-100,600 C200,720 400,450 700,680 C850,750 950,650 1100,600" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6, 8" opacity="0.4" />
          </svg>
        </div>

        {/* Heading block */}
        <div className="text-center space-y-3 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-950 uppercase">
            About NF Technologies
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full shadow-[0_2px_6px_rgba(6,182,212,0.3)]" />
        </div>

        {/* Core Founding Statement Card */}
        <div className="bg-zinc-50 border border-zinc-200/80 border-l-4 border-l-cyan-500 p-5 md:p-6 rounded-r-2xl space-y-2.5 text-left relative z-10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-600 shrink-0" />
            <p className="text-xs font-mono text-cyan-600 uppercase tracking-wider font-bold">Founded by Ngoveni Nhlamulo Fortitude</p>
          </div>
          <p className="text-zinc-700 text-sm md:text-base leading-relaxed font-medium">
            NF Technologies was founded by Ngoveni Nhlamulo Fortitude, an 18-year-old student at the University of the Witwatersrand (Wits), with a vision to help businesses grow through innovative technology.
          </p>
        </div>

        {/* Grid Layout of the Shared Dream & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left relative z-10">
          {/* Box 1: The Dream */}
          <div className="border border-zinc-200/80 rounded-2xl p-6 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.05)] transition-all space-y-3.5 bg-white backdrop-blur-md">
            <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500">
              <Heart className="w-5 h-5 shrink-0" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 font-display">The Shared Dream</h3>
            <p className="text-zinc-650 text-xs md:text-sm leading-relaxed">
              The idea for NF Technologies began as a dream shared with my girlfriend, Khanyisa. We imagined creating more than just websites—we wanted to build technology that helps businesses work smarter, connect better with their customers, and grow with confidence.
            </p>
          </div>

          {/* Box 2: Our Mission */}
          <div className="border border-zinc-200/80 rounded-2xl p-6 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.05)] transition-all space-y-3.5 bg-white backdrop-blur-md">
            <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600">
              <Globe className="w-5 h-5 shrink-0" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 font-display">Our Global Mission</h3>
            <p className="text-zinc-650 text-xs md:text-sm leading-relaxed">
              Today, NF Technologies delivers modern websites, mobile applications, AI automation, SaaS solutions, cybersecurity, digital marketing, branding, and e-commerce solutions. Our mission is to give businesses access to professional, reliable, and future-ready technology that helps them succeed in an increasingly digital world.
            </p>
          </div>
        </div>

        {/* In-depth story block: More than technology */}
        <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-zinc-50/50 p-6 md:p-8 space-y-5 text-left relative z-10 backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-600" />
              <span className="text-[10px] font-mono tracking-wider text-cyan-600 uppercase block font-bold">Inspiration & Heritage</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-zinc-900 font-display">But this company is about more than technology.</h3>
          </div>

          <div className="space-y-4 text-zinc-650 text-xs md:text-sm leading-relaxed">
            <p>
              Growing up in <strong className="text-zinc-900 font-semibold">Magoro, Limpopo</strong>, I learned that where you come from does not determine where you can go. Like many young people, I've experienced challenges that shaped the way I see the world. Those experiences inspired me to dream bigger—not only for myself, but for others as well.
            </p>
            <p>
              My long-term vision is to build a company that creates opportunities, inspires innovation, and proves that young people from any background can build businesses that make a global impact.
            </p>
            <p className="bg-white border border-zinc-200 rounded-xl p-4 italic text-zinc-700 shadow-sm leading-relaxed border-l-4 border-l-cyan-500">
              "I especially hope to encourage young people who have faced anxiety, trauma, or difficult circumstances to believe that their past does not define their future. With determination, learning, and courage, it's possible to create something meaningful."
            </p>
          </div>
        </div>

        {/* Bottom Statement Badge */}
        <div className="text-center pt-2 space-y-2 relative z-10">
          <p className="text-xs font-mono font-bold tracking-wider text-cyan-600 uppercase">At NF Technologies, we don't just build technology.</p>
          <p className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-cyan-700 tracking-tight font-display">
            We build solutions, create opportunities, and inspire the future.
          </p>
        </div>
      </div>

      {/* Footer action */}
      <div className="bg-zinc-50 px-6 md:px-8 py-4 border-t border-zinc-200 flex justify-end">
        <button
          onClick={onNavigateToServices}
          className="py-2.5 px-6 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-cyan-500 text-white hover:bg-cyan-400 hover:shadow-[0_4px_12px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer shadow-sm"
        >
          Explore Services
        </button>
      </div>
    </motion.div>
  );
}
