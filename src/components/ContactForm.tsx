import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Send, 
  CheckCircle, 
  Receipt, 
  FileText, 
  Phone, 
  Mail, 
  Building, 
  User, 
  Printer, 
  Download,
  Database
} from 'lucide-react';
import { Pillar, ProposalForm } from '../types';

interface ContactFormProps {
  pillars: Pillar[];
  selectedIds: number[];
  onClose: () => void;
}

interface SavedProposal {
  id: string;
  date: string;
  form: ProposalForm;
  selectedPillarTitles: string[];
  totalSetup: number;
  totalMonthly: number;
}

export default function ContactForm({ pillars, selectedIds, onClose }: ContactFormProps) {
  const [form, setForm] = useState<ProposalForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProposal, setSubmittedProposal] = useState<SavedProposal | null>(null);

  // Filter selected pillars
  const selectedPillars = pillars.filter(p => selectedIds.includes(p.id));
  const totalSetup = selectedPillars.reduce((acc, p) => acc + p.setupFee, 0);
  const totalMonthly = selectedPillars.reduce((acc, p) => acc + (p.hasMonthly ? p.monthlyFee : 0), 0);

  const formatRand = (num: number) => `R${num.toLocaleString('en-ZA')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending with minor delay
    setTimeout(() => {
      const newProposal: SavedProposal = {
        id: `PROP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        form: { ...form },
        selectedPillarTitles: selectedPillars.map(p => p.title),
        totalSetup,
        totalMonthly
      };

      // Persist in localStorage
      const existing = localStorage.getItem('nf_proposals');
      const proposals = existing ? JSON.parse(existing) : [];
      proposals.unshift(newProposal);
      localStorage.setItem('nf_proposals', JSON.stringify(proposals));

      setIsSubmitting(false);
      setSubmittedProposal(newProposal);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="contact-form-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white border border-zinc-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-zinc-800"
      >
        {/* Close Button */}
        <button
          id="close-proposal-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 cursor-pointer transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="p-6 md:p-8">
          {!submittedProposal ? (
            /* Contact and Package Selection Form */
            <form id="lead-proposal-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-600 font-bold block mb-1">Custom Solution</span>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Request Dynamic Proposal</h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Fill in your company details to generate a formal digital services agreement for your custom package.
                </p>
              </div>

              {/* Package Summary Box inside Form */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Package Setup Overview</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2">
                  {selectedPillars.map(p => (
                    <span key={p.id} className="text-[10px] px-2.5 py-1 rounded-md bg-white text-zinc-800 border border-zinc-200 shadow-xs">
                      {p.title}
                    </span>
                  ))}
                </div>
                <div className="h-[1px] bg-zinc-200" />
                <div className="flex justify-between items-center text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Setup Total</span>
                    <strong className="text-zinc-900 font-mono text-sm">{formatRand(totalSetup)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Monthly Subscription</span>
                    <strong className="text-cyan-600 font-mono text-sm">{formatRand(totalMonthly)}/mo</strong>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="form-name" className="text-xs font-mono uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Your Name</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 placeholder:text-zinc-450 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="form-company" className="text-xs font-mono uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Company / Business</span>
                  </label>
                  <input
                    id="form-company"
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Company name"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 placeholder:text-zinc-450 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="form-email" className="text-xs font-mono uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Email Address</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.co.za"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 placeholder:text-zinc-450 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="form-phone" className="text-xs font-mono uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    id="form-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+27 (00) 000-0000"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 placeholder:text-zinc-450 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="form-message" className="text-xs font-mono uppercase tracking-wider text-zinc-600">
                  Business Context & Custom Goals
                </label>
                <textarea
                  id="form-message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your primary business objectives, timeline constraints, or any custom integrations you might need..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 placeholder:text-zinc-450 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                id="submit-proposal-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-cyan-500 text-white hover:bg-cyan-400 hover:shadow-[0_4px_12px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Digital Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Generate & Save Official Proposal</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Proposal Generated Document View (Printable Invoice/Receipt) */
            <div id="proposal-document-view" className="space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 pb-5 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-xs">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wider">Dynamic Proposal</h4>
                    <p className="text-[10px] font-mono text-cyan-600">{submittedProposal.id}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase block">Generated On</span>
                  <p className="text-xs text-zinc-700 font-mono font-medium">{submittedProposal.date}</p>
                </div>
              </div>

              {/* Print-friendly content zone */}
              <div id="proposal-printable-area" className="space-y-5 p-5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs shadow-sm text-zinc-800">
                {/* Visual watermark */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 text-left">
                    <h5 className="font-sans font-extrabold tracking-widest text-zinc-900 uppercase text-sm">NF Technologies</h5>
                    <p className="text-[10px] font-mono text-cyan-600 font-semibold">Innovate • Automate • Elevate</p>
                  </div>
                  <div className="text-right text-zinc-600 text-[10px] font-mono space-y-0.5">
                    <p>Client Inquiry Division</p>
                    <p>072 103 0264</p>
                    <p>Nhlamulongoveni421@gmail.com</p>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-200" />

                {/* Client info */}
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-400 uppercase block mb-0.5">Prepared For:</span>
                    <p className="font-bold text-zinc-900">{submittedProposal.form.name}</p>
                    <p className="text-zinc-600">{submittedProposal.form.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase block mb-0.5">Contact Details:</span>
                    <p className="text-zinc-600">{submittedProposal.form.email}</p>
                    <p className="text-zinc-600">{submittedProposal.form.phone}</p>
                  </div>
                </div>

                {/* Selected Solutions list */}
                <div className="space-y-2 text-left">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase block">Selected Services & Infrastructure Pillars</span>
                  <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 text-[9px] font-mono uppercase text-zinc-500 bg-zinc-50">
                          <th className="p-2.5 font-bold">Pillar Description</th>
                          <th className="p-2.5 font-bold text-right">Standard Setup</th>
                          <th className="p-2.5 font-bold text-right">Monthly Licence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPillars.map(p => (
                          <tr key={p.id} className="border-b border-zinc-150 hover:bg-zinc-50 transition-colors">
                            <td className="p-2.5 text-zinc-800 font-medium">{p.title}</td>
                            <td className="p-2.5 text-right text-zinc-700 font-mono">{formatRand(p.setupFee)}</td>
                            <td className="p-2.5 text-right text-cyan-600 font-mono">{p.hasMonthly ? formatRand(p.monthlyFee) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-zinc-900 text-white p-4 rounded-lg border border-zinc-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
                  <div className="space-y-0.5">
                    <h6 className="font-bold text-white">Total Investment Package</h6>
                    <p className="text-[10px] text-zinc-400">Subject to standard NF Technologies service agreement terms.</p>
                  </div>
                  <div className="flex gap-6 text-right shrink-0">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-450 uppercase block">Setup Capital</span>
                      <strong className="text-lg font-black text-white font-mono">{formatRand(submittedProposal.totalSetup)}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-cyan-400 uppercase block">Monthly Recurring</span>
                      <strong className="text-lg font-black text-cyan-400 font-mono">{formatRand(submittedProposal.totalMonthly)}<span className="text-xs font-normal text-zinc-400">/mo</span></strong>
                    </div>
                  </div>
                </div>

                {/* Client message / context */}
                <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-lg text-left">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">Business Notes & Objectives Provided:</span>
                  <p className="text-zinc-700 italic leading-relaxed font-sans text-xs">
                    "{submittedProposal.form.message}"
                  </p>
                </div>
              </div>

              {/* Action buttons (Print, Download, Close) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="print-proposal-btn"
                  onClick={handlePrint}
                  className="flex-1 py-3 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase border border-zinc-200 text-zinc-700 hover:bg-zinc-50 bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document / Save PDF</span>
                </button>

                <button
                  id="done-proposal-btn"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-cyan-500 text-white hover:bg-cyan-400 hover:shadow-[0_4px_12px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed & Return</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
