import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  CheckSquare, 
  FileText, 
  Briefcase, 
  TrendingUp,
  Target,
  ArrowDown,
  Phone,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  Menu,
  X,
  Heart,
  GraduationCap,
  Globe,
  Award,
  BookOpen
} from 'lucide-react';
import Logo from './components/Logo';
import PillarCard from './components/PillarCard';
import BundleBuilder from './components/BundleBuilder';
import ContactForm from './components/ContactForm';
import AboutPage from './components/AboutPage';
import AIAssistant from './components/AIAssistant';
import { Pillar } from './types';
import aiRobotAssistantImg from './assets/images/ai_robot_assistant_1783330276211.jpg';

export default function App() {
  // Pre-select first 3 pillars (Web, AI Automation, SaaS) as a premium recommended starter bundle
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3]);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'bundle'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = (item: string) => {
    setIsMenuOpen(false);
    if (item === 'home') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'about') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'services') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('services-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (item === 'contacts') {
      setCurrentPage('bundle');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'ask') {
      window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: { type: 'chat' } }));
    }
  };

  // Define the 9 pillars with Unsplash URLs and direct parameters from the business document
  const pillars: Pillar[] = [
    {
      id: 1,
      title: "Website Development",
      setupFee: 2500,
      monthlyFee: 300,
      hasMonthly: true,
      angle: "Every other service is easier to sell once you're already 'the website person' for a client.",
      description: "Establish client authority with custom, mobile-responsive, lightning-fast static and dynamic web platforms. Setup includes standard Google Business Profile registration (R1,000 value) to dominate local SEO rankings right from the start.",
      services: [
        "Custom React & Tailwind Coding",
        "Google Business Profile Integration",
        "Core SEO and Page Speed Setup",
        "Secure Domain & SSL Provisioning"
      ],
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "AI Automation Agency",
      setupFee: 1500,
      monthlyFee: 300,
      hasMonthly: true,
      angle: "Never miss a customer lead again — huge appeal to local service businesses like salons, clinics, and restaurants.",
      description: "Deploy interactive conversational chatbots, bespoke voice agents (R3,500 standalone option), and customized WhatsApp Business automation funnels that capture high-intent leads and schedule reservations 24/7.",
      services: [
        "WhatsApp Business API Integration",
        "Interactive Chatbot Lead Capture",
        "24/7 AI Receptionist Setup",
        "Live Dashboard & Monitoring Suite"
      ],
      imageUrl: aiRobotAssistantImg
    },
    {
      id: 3,
      title: "Software (SaaS)",
      setupFee: 5000,
      monthlyFee: 1000,
      hasMonthly: true,
      angle: "Start by building one for a single client at full price, then re-sell the same core product to others at a lower setup cost — this is where real recurring wealth is built.",
      description: "Develop or lease proprietary high-margin cloud software. Hand over customized booking engines, interactive quotation builders, micro-CRMs, or asset management dashboards that clients can't operate without.",
      services: [
        "Multi-Tenant SaaS Architecture",
        "Secure Stripe/Zapper API Billing",
        "Dynamic Client Admin Dashboards",
        "Automated PDF Invoicing Engines"
      ],
      ideas: ["AI Receptionist", "WhatsApp CRM", "Invoice Gen", "School portal", "Appointment Booking", "Property Suite"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Mobile App Development",
      setupFee: 7500,
      monthlyFee: 500,
      hasMonthly: true,
      angle: "Two high-margin paths: bespoke enterprise client app contracts, and publishing owned store assets for long-term passive ad/subscription income.",
      description: "Build robust, cross-platform Android & iOS applications. From restaurant ordering networks and school management portals to localized church apps, gym fitness logs, and multi-tenant delivery dispatch trackers.",
      services: [
        "Cross-Platform Flutter/React Native",
        "Apple App Store & Google Play Upload",
        "Native Push Notifications & Logs",
        "Secure Local SQL State Management"
      ],
      ideas: ["Restaurant Ordering", "School Portals", "Church Portals", "Fitness Loggers", "Delivery Trackers"],
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Cybersecurity Agency",
      setupFee: 5000,
      monthlyFee: 1000,
      hasMonthly: true,
      angle: "Clients rarely think about security until something breaks — position it as an essential, non-negotiable insurance policy.",
      description: "Provide high-trust, high-margin cybersecurity operations. Perform comprehensive security audits, vulnerability scanning, automated backup restorations, anti-phishing training, and email security configurations.",
      services: [
        "Vulnerability Scanning & Reports",
        "Automated Cloud Daily Backups",
        "Phishing Awareness Campaigns",
        "Spam Filter & DNS Sec Configuration"
      ],
      ideas: ["Vulnerability Audits", "Staff awareness training", "SSO/MFA deployment", "Compliance Trackers"],
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Digital Marketing",
      setupFee: 3000,
      monthlyFee: 5000,
      hasMonthly: true,
      angle: "The highest-ticket recurring service — sell it once a client already trusts you from website, brand, or GBP work.",
      description: "Maximize client sales pipelines with professional, ROI-driven marketing campaigns. Includes expert management of Google Ads budgets, targeted Meta campaigns, Local SEO ranking, and monthly content outreach.",
      services: [
        "Meta Ads (Facebook & Instagram)",
        "Google Ads & Maps Ad Management",
        "Advanced SEO Keyword Content",
        "Monthly ROI Reporting Analytics"
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 7,
      title: "Video Production & Editing",
      setupFee: 5000,
      monthlyFee: 0,
      hasMonthly: false,
      angle: "A high-impact one-off video production package to instantly capture brand attention and jumpstart social feeds.",
      description: "Produce dynamic, eye-catching short-form video content (TikToks, Reels, YouTube Shorts) designed to convert eyeballs into customers. Package includes high-converting copy scripting and professional edits.",
      services: [
        "One-Off Content Batch (8–12 clips)",
        "Short-form Hook & Scriptwriting",
        "Cinematic Graphics & Typography",
        "Automated Social Post Scheduler"
      ],
      imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 8,
      title: "Branding & Graphic Design",
      setupFee: 5000,
      monthlyFee: 2500,
      hasMonthly: true,
      angle: "Ultimate branding setup with an ongoing design retainer to supply custom ad creatives, slides, and social graphics month after month.",
      description: "Create memorable and modern visual identities. From complete corporate rebranding kits to business cards, presentation slides, posters, social media banners, and print-ready company profiles.",
      services: [
        "Logo Architecture & Submarks",
        "Comprehensive Brand Color Guides",
        "Monthly Graphic Retainer Assets",
        "Print-ready Company Profiles"
      ],
      imageUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 9,
      title: "E-Commerce Systems",
      setupFee: 10000,
      monthlyFee: 1000,
      hasMonthly: true,
      angle: "Build robust storefronts for local retail clients, or launch highly optimized dropshipping/print-on-demand sites of your own.",
      description: "Develop seamless, conversion-optimized online shopping platforms. Integrated with South African payment getaways (PayFast, Peach Payments, Stitch), product catalogs, shipping logistics, and cart abandonment recoverers.",
      services: [
        "Peach/PayFast Gateway Setup",
        "Automated Courier API Shipping",
        "Cart Recovery Email Flows",
        "Inventory Tracking Dashboards"
      ],
      ideas: ["Print-on-Demand ventures", "Digital Template stores", "Direct client retail builds"],
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const handleTogglePillar = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const scrollToCalculator = () => {
    setCurrentPage('bundle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden pb-12 relative">
      {/* Top Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Navigation Header */}
        <header className="flex justify-between items-center py-6 border-b border-slate-900 sticky top-0 bg-slate-950/85 backdrop-blur-md z-40">
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg cursor-pointer transition-all flex items-center justify-center"
              aria-label="Open navigation menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 shrink-0" />
            </button>
            {/* SVG Logo matching the reference exactly */}
            <Logo size="sm" showText={false} />
            <div className="hidden xs:block">
              <span className="text-sm font-black tracking-widest text-white uppercase font-display block leading-none">NF Technologies</span>
              <span className="text-[9px] font-mono tracking-wider text-cyan-400 uppercase">Innovate • Automate • Elevate</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToCalculator}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Simulator</span>
            </button>
            <button
              onClick={() => setIsProposalOpen(true)}
              className="py-2.5 px-4 rounded-xl font-mono text-[11px] font-bold tracking-wider uppercase bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              Build Package
            </button>
          </div>
        </header>

        {/* Main Routing Views */}
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <section className="pt-8 md:pt-12 text-center max-w-4xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs uppercase font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recurring Revenue Model</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400 tracking-tight font-display leading-[1.1] pb-1">
                  The Digital Empire Ecosystem
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  One interconnected agency network where every digital service feeds the next. Establish relationships with high-converting branding, scale into secure systems, and secure long-term monthly recurring revenue.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={scrollToCalculator}
                    className="py-3 px-6 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Launch Revenue Calculator</span>
                    <ArrowDown className="w-4 h-4 shrink-0" />
                  </button>
                </div>

                {/* Core statistics / metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-900">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider mb-1">Total Entry Points</span>
                    <p className="text-2xl font-black text-white">9 Pillars</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider mb-1">Max Setup Value</span>
                    <p className="text-2xl font-black text-cyan-400 font-mono">R45,500</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider mb-1">Max Monthly Sub</span>
                    <p className="text-2xl font-black text-cyan-400 font-mono">R8,100</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider mb-1">Ecosystem Margin</span>
                    <p className="text-2xl font-black text-white">90%+</p>
                  </div>
                </div>
              </section>

              {/* 9 Pillars Bento Grid Showcase */}
              <section id="services-section" className="space-y-8 scroll-mt-24">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs uppercase font-bold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Modular Core Pillars</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight font-display">
                    Explore Our Digital Agency Architecture
                  </h2>
                  <p className="text-sm text-slate-400">
                    Each pillar operates as a standalone service, but converts clients organically into monthly subscription subscribers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pillars.map((pillar, index) => (
                    <PillarCard
                      key={pillar.id}
                      pillar={pillar}
                      isSelected={selectedIds.includes(pillar.id)}
                      onToggle={() => handleTogglePillar(pillar.id)}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AboutPage onNavigateToServices={() => handleMenuItemClick('services')} />
            </motion.div>
          )}

          {currentPage === 'bundle' && (
            <motion.div
              key="bundle-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="bg-white border border-zinc-200/85 rounded-3xl p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] text-zinc-800 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">Empire Simulator</span>
                <h2 className="text-3xl font-black text-zinc-950 font-display tracking-tight mt-2">Interactive Client Proposal Builder</h2>
                <p className="text-sm text-zinc-600 mt-3 leading-relaxed max-w-3xl">
                  Welcome to the official NF Technologies interactive configuration suite. Toggle the service pillars in the services section to add them to your custom corporate bundle, then configure setup requirements and request an automated official PDF contract.
                </p>
              </div>

              <BundleBuilder
                pillars={pillars}
                selectedIds={selectedIds}
                onTogglePillar={handleTogglePillar}
                onOpenProposal={() => setIsProposalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* High-fidelity Brand Footer */}
        <footer className="border-t border-slate-900 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-900 mb-8 text-left">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Logo size="sm" showText={false} />
                <div>
                  <span className="text-sm font-black tracking-widest text-white uppercase font-display block leading-none">NF Technologies</span>
                  <span className="text-[9px] font-mono tracking-wider text-cyan-400 uppercase">Innovate • Automate • Elevate</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                A premier 9-pillar digital agency and software services ecosystem specializing in high-growth, recurring revenue models. Let's construct your dynamic digital empire today.
              </p>
            </div>

            {/* Column 2: Direct Contact */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Direct Channels</span>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="https://wa.me/27721030264" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors group">
                    <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>WhatsApp or Call: <strong className="font-mono text-white group-hover:underline">072 103 0264</strong></span>
                  </a>
                </li>
                <li>
                  <a href="mailto:Nhlamulongoveni421@gmail.com" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors group">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Email: <strong className="font-mono text-white group-hover:underline">Nhlamulongoveni421@gmail.com</strong></span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Social Connectivity */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Connect With Us</span>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <a href="https://linkedin.com/company/nf-technologies" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors group">
                  <Linkedin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="group-hover:underline">LinkedIn</span>
                </a>
                <a href="https://facebook.com/nf-technologies" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors group">
                  <Facebook className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="group-hover:underline">Facebook</span>
                </a>
                <a href="https://instagram.com/nf-technologies" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors group">
                  <Instagram className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="group-hover:underline">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">© 2026 NF Technologies. All Rights Reserved.</span>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              <a href="#pillar-card-1" className="hover:text-cyan-400 transition-colors">Web</a>
              <a href="#pillar-card-2" className="hover:text-cyan-400 transition-colors">AI Automation</a>
              <a href="#pillar-card-5" className="hover:text-cyan-400 transition-colors">Cybersecurity</a>
              <a href="#pillar-card-3" className="hover:text-cyan-400 transition-colors">SaaS Products</a>
              <a href="#pillar-card-6" className="hover:text-cyan-400 transition-colors">Growth Marketing</a>
            </div>
          </div>
        </footer>

      </div>

      {/* Dynamic Modal Overlay for Lead-Capture & Custom Proposal Generation */}
      <AnimatePresence>
        {isProposalOpen && (
          <ContactForm
            pillars={pillars}
            selectedIds={selectedIds}
            onClose={() => setIsProposalOpen(false)}
          />
        )}
      </AnimatePresence>



      {/* Slide-out Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Sidebar Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#030712] border-r border-slate-900 shadow-2xl z-50 flex flex-col p-6 text-slate-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-5 border-b border-slate-900 mb-6">
                <div className="flex items-center gap-2.5">
                  <Logo size="sm" showText={false} />
                  <div className="text-left">
                    <span className="text-xs font-black tracking-widest text-white uppercase font-display block leading-none">NF Technologies</span>
                    <span className="text-[8px] font-mono tracking-wider text-cyan-400 uppercase">Innovate • Automate • Elevate</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col space-y-1.5 font-mono text-xs uppercase font-bold tracking-wider text-slate-300">
                <button
                  onClick={() => handleMenuItemClick('home')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-slate-900 hover:text-cyan-400 border border-transparent hover:border-slate-800 transition-all text-left cursor-pointer w-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => handleMenuItemClick('about')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-slate-900 hover:text-cyan-400 border border-transparent hover:border-slate-800 transition-all text-left cursor-pointer w-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>About Story</span>
                </button>

                <button
                  onClick={() => handleMenuItemClick('services')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-slate-900 hover:text-cyan-400 border border-transparent hover:border-slate-800 transition-all text-left cursor-pointer w-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>9 Pillars Services</span>
                </button>

                <button
                  onClick={() => handleMenuItemClick('contacts')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-slate-900 hover:text-cyan-400 border border-transparent hover:border-slate-800 transition-all text-left cursor-pointer w-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>Interactive Bundle / Contacts</span>
                </button>

                <button
                  onClick={() => handleMenuItemClick('ask')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 transition-all text-left cursor-pointer w-full shadow-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                  <span>Ask Mary (AI Assistant)</span>
                </button>
              </div>

              {/* Drawer Footer info */}
              <div className="pt-6 border-t border-slate-900 space-y-4 text-left">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-slate-500">Direct Support</p>
                  <p className="text-xs font-bold text-white">072 103 0264</p>
                  <p className="text-[10px] font-mono text-slate-400">Nhlamulongoveni421@gmail.com</p>
                </div>
                <div className="flex gap-3 text-slate-400">
                  <a href="https://linkedin.com/company/nf-technologies" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://facebook.com/nf-technologies" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                    <Facebook className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://instagram.com/nf-technologies" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating AI & WhatsApp Assistants */}
      <AIAssistant />
    </div>
  );
}
