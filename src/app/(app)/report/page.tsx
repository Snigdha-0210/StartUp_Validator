'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { FileText, Share, Download, Sparkles, Database, Globe, Gavel, FileJson, Presentation, FileImage, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function ReportPage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [hasNewInsight, setHasNewInsight] = useState(true);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setIsExporting(format);
    const isPremium = format !== "PDF" && format !== "JSON";
    if (typeof pendo !== 'undefined') {
      pendo.track("report_exported", {
        startup_id: activeStartup?.id,
        startup_name: activeStartup?.name,
        export_format: format,
        is_premium_format: isPremium,
        success: !isPremium,
      });
    }
    if (format === "PDF") {
      setTimeout(() => {
        window.print();
        setIsExporting(null);
      }, 500);
    } else if (format === "JSON") {
      setTimeout(() => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ project: "Lumina", status: "Validated" }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "report.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        setIsExporting(null);
      }, 500);
    } else {
      setTimeout(() => {
        alert(`Exporting as ${format} is a premium feature. Upgrade to Pro.`);
        setIsExporting(null);
      }, 800);
    }
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    if (typeof pendo !== 'undefined') {
      pendo.track("report_section_regenerated", {
        startup_id: activeStartup?.id,
        startup_name: activeStartup?.name,
      });
    }
    setTimeout(() => {
      setIsRegenerating(false);
      setHasNewInsight(false);
    }, 2000);
  };

  const sections = [
    { id: "executive-summary", number: "01", title: "Executive Summary" },
    { id: "market-analysis", number: "02", title: "Market Analysis" },
    { id: "competition-analysis", number: "03", title: "Competition Analysis" },
    { id: "customer-profile", number: "04", title: "Customer Profile" },
    { id: "pricing-strategy", number: "05", title: "Pricing Strategy" },
    { id: "investment-decision", number: "06", title: "Investment Decision" }
  ];

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden w-full print:h-auto print:overflow-visible">
      {/* HEADER / ACTIONS BAR */}
      <header className="h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 flex items-center justify-between px-8 z-40 print:hidden">
        <div className="flex items-center gap-4">
          <FileText className="text-primary/70 w-6 h-6" />
          <div>
            <h2 className="font-heading text-lg text-foreground font-bold leading-tight">Venture Synthesis Report: {activeStartup?.name || "Project Lumina"}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></span>
              AI Generated Analysis • Generated June 12, 2024
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-foreground hover:bg-white/5 transition-all text-sm font-semibold">
            <Share className="w-4 h-4" /> Share Report
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all text-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible print:block">
        
        {/* DOCUMENT NAVIGATION (LEFT SUB-SIDEBAR) */}
        <nav className="w-72 bg-black/20 border-r border-white/5 p-6 overflow-y-auto hidden lg:block print:hidden">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">Report Structure</p>
          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <a key={sec.id} href={`#${sec.id}`} className={`group flex flex-col gap-1.5 p-3 rounded-lg border transition-all ${idx === 0 ? 'bg-primary/5 border-primary/20' : 'border-white/5 hover:border-white/20'}`}>
                <span className={`text-xs font-bold uppercase tracking-wide ${idx === 0 ? 'text-primary' : 'text-muted-foreground'}`}>Section {sec.number}</span>
                <span className={`text-sm font-semibold transition-colors ${idx === 0 ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{sec.title}</span>
              </a>
            ))}
          </div>

          <div className="mt-12 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <Sparkles className="text-primary w-5 h-5 mb-2" />
            <h4 className="text-sm font-bold text-foreground mb-2">Analysis Quality</h4>
            <div className="flex gap-1 mb-3">
              <div className="h-1.5 w-full rounded-full bg-primary"></div>
              <div className="h-1.5 w-full rounded-full bg-primary"></div>
              <div className="h-1.5 w-full rounded-full bg-primary"></div>
              <div className="h-1.5 w-8 rounded-full bg-white/10"></div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">High precision data verified against 42 market sources.</p>
          </div>
        </nav>

        {/* DOCUMENT VIEWER CANVAS */}
        <div className="flex-1 overflow-y-auto bg-black/10 p-8 md:p-12 flex justify-center items-start print:overflow-visible print:bg-white print:p-0 print:block">
          {/* THE WHITE DOCUMENT */}
          <div className="bg-white rounded-sm p-12 md:p-16 text-slate-900 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full max-w-[21cm] min-h-[29.7cm] print:shadow-none print:max-w-none print:m-0 print:p-0">
            
            {/* Brand Watermark */}
            <div className="absolute top-10 right-10 flex items-center gap-2 opacity-10 select-none pointer-events-none">
              <span className="font-heading font-black text-xl tracking-tighter text-slate-900">LaunchLens</span>
            </div>

            {/* Header Section */}
            <div className="border-b-2 border-slate-900 pb-10 mb-12">
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Venture Analysis Report ID: #LL-{Math.floor(Math.random()*10000)}-X</p>
              <h1 className="font-heading text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6" id="executive-summary">Executive Summary: {activeStartup?.name || "Project Lumina"}</h1>
              <div className="flex gap-8 md:gap-12 flex-wrap">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Category</p>
                  <p className="text-sm font-bold text-slate-800">{activeStartup?.category || "SaaS"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Risk Factor</p>
                  <p className="text-sm font-bold text-slate-800">{activeStartup?.riskLevel || "Low-to-Medium"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Market Readiness</p>
                  <p className="text-sm font-bold text-emerald-600">Optimal ({activeStartup?.overallScore || 84}/100)</p>
                </div>
              </div>
            </div>

            {/* Executive Summary Content */}
            <section className="mb-12">
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">01</span>
                Foundational Overview
              </h2>
              <p className="text-lg leading-relaxed text-slate-700 mb-6 italic font-medium">
                {activeStartup?.description || "Project Lumina aims to disrupt the distributed energy resources market."}
              </p>
              <p className="leading-relaxed text-slate-600 mb-4 font-medium">
                {activeStartup?.investorData?.thesis || "The core value proposition lies in its proprietary algorithm."}
              </p>
            </section>

            {/* Market Analysis Section */}
            <section className="mb-12" id="market-analysis">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">02</span>
                Market Analysis & TAM/SAM/SOM
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-4 tracking-wider">Growth Projection</h4>
                  <div className="h-32 flex items-end gap-2 px-2">
                    <div className="w-full bg-slate-200 rounded-t-sm h-[30%]"></div>
                    <div className="w-full bg-slate-200 rounded-t-sm h-[45%]"></div>
                    <div className="w-full bg-slate-200 rounded-t-sm h-[60%]"></div>
                    <div className="w-full bg-[#22c55e] rounded-t-sm h-[85%]"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold px-1">
                    <span>2024</span><span>2025</span><span>2026</span><span>2027</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-black text-slate-900">{activeStartup?.investorData?.marketPotential?.tam || "$12.4B"}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Total Addressable Market (TAM)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-900">22%</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">CAGR (Estimated 2024-2029)</p>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-slate-600 font-medium">
                {activeStartup?.roastData?.marketSentiment?.moat || "The adoption is expected to grow significantly."}
              </p>
            </section>

            {/* Competition Analysis */}
            <section className="mb-12" id="competition-analysis">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">03</span>
                Competition Landscape
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <th className="py-3 pr-4">Competitor</th>
                      <th className="py-3 px-4">Focus Area</th>
                      <th className="py-3 px-4">Moat Strength</th>
                      <th className="py-3 pl-4">Lumina Edge</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {(activeStartup?.competitors || []).map((comp, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-4 pr-4 font-bold">{comp.name}</td>
                        <td className="py-4 px-4 font-medium">{comp.strengths[0] || "Unknown"}</td>
                        <td className="py-4 px-4 font-medium">{comp.threatLevel}</td>
                        <td className="py-4 pl-4 text-emerald-600 font-bold">{comp.differentiation}</td>
                      </tr>
                    ))}
                    {(!activeStartup?.competitors || activeStartup.competitors.length === 0) && (
                      <tr className="border-b border-slate-100">
                        <td className="py-4 pr-4 font-bold" colSpan={4}>Generate validation to see competitors</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Customer Profile */}
            <section className="mb-12" id="customer-profile">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">04</span>
                Ideal Customer Profile (ICP)
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-100 shrink-0 overflow-hidden border-4 border-white shadow-md">
                  <img 
                    className="w-full h-full object-cover mix-blend-multiply opacity-90" 
                    alt="ICP Avatar" 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop"
                  />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">"{activeStartup?.primaryICP?.title || "The Conscious Optimizer"}"</h4>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed italic font-medium">
                    {activeStartup?.primaryICP?.description || "Homeowners aged 30-55..."}
                  </p>
                </div>
              </div>
            </section>

            {/* Pricing Strategy */}
            <section className="mb-12" id="pricing-strategy">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">05</span>
                Pricing & GTM Strategy
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Starter Tier</p>
                  <p className="text-xl font-black text-slate-900">${activeStartup?.deepPricing?.starterPrice || 19}/mo</p>
                </div>
                <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Growth Tier</p>
                  <p className="text-xl font-black text-slate-900">${activeStartup?.deepPricing?.growthPrice || 99}/mo</p>
                </div>
              </div>
            </section>

            {/* Investment Decision */}
            <section className="p-8 md:p-10 bg-slate-900 rounded-2xl text-white" id="investment-decision">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black mb-2">Final Recommendation</h2>
                  <p className="text-slate-400 text-sm font-medium">Automated scoring based on all data pillars.</p>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center shrink-0">
                  <span className="text-xl md:text-2xl font-black text-emerald-400">{activeStartup?.investorData?.confidenceScore || 92}%</span>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
                <p className="font-bold text-emerald-400 mb-3 uppercase text-[10px] tracking-widest">Decision Verdict</p>
                <h3 className="text-2xl font-bold mb-4">{activeStartup?.investorData?.decision === "YES" ? "Strong Proceed" : "Hard Pass"}</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  {activeStartup?.investorData?.thesis || "Lumina presents a rare combination of favorable market timing..."}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center opacity-50 text-[10px] uppercase font-bold tracking-widest border-t border-white/10 pt-6 gap-4">
                <span>Analysis by LaunchLens AI Engine</span>
                <span>Sign: _________________________</span>
              </div>
            </section>

          </div>
        </div>

        {/* INTELLIGENCE PANEL (RIGHT SUB-SIDEBAR) */}
        <aside className="w-80 bg-black/20 border-l border-white/5 p-6 overflow-y-auto hidden xl:block print:hidden">
          <h3 className="font-heading text-sm font-bold mb-6 text-foreground uppercase tracking-wider">Data Sources Verified</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <Database className="text-primary w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Pitchbook API</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Venture Financials Sync</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <Globe className="text-primary w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Statista Global</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Market Size Delta</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <Gavel className="text-primary w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">SEC EDGAR</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Regulatory Filing Check</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="font-heading text-sm font-bold mb-6 text-foreground uppercase tracking-wider flex items-center gap-2">
              Export Formats
              <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "PDF", icon: FileImage, color: "hover:border-red-500/50 hover:bg-red-500/5", textColor: "group-hover:text-red-500" },
                { name: "Excel", icon: FileText, color: "hover:border-green-500/50 hover:bg-green-500/5", textColor: "group-hover:text-green-500" },
                { name: "PPTX", icon: Presentation, color: "hover:border-orange-500/50 hover:bg-orange-500/5", textColor: "group-hover:text-orange-500" },
                { name: "JSON", icon: FileJson, color: "hover:border-cyan-500/50 hover:bg-cyan-500/5", textColor: "group-hover:text-cyan-500" }
              ].map((format, i) => (
                <motion.button 
                  key={format.name}
                  onClick={() => handleExport(format.name)}
                  disabled={isExporting !== null}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`p-4 rounded-xl border border-white/10 transition-all flex flex-col items-center gap-2 group ${format.color} relative overflow-hidden disabled:opacity-50`}
                >
                  {isExporting === format.name ? (
                    <RefreshCw className={`text-muted-foreground ${format.textColor} w-6 h-6 animate-spin`} />
                  ) : (
                    <format.icon className={`text-muted-foreground ${format.textColor} w-6 h-6 transition-colors relative z-10`} />
                  )}
                  <span className={`text-[10px] font-bold text-muted-foreground ${format.textColor} transition-colors relative z-10`}>
                    {isExporting === format.name ? "EXPORTING" : format.name}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>
              ))}
            </div>
          </div>

          {hasNewInsight && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: 0.5 }}
              className="mt-12 relative group"
            >
              {/* Animated glowing border behind the card */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              
              <div className="relative p-6 rounded-xl bg-[#0B0F0C] border border-white/10 overflow-hidden">
                {/* Radar sweep effect inside card */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute -top-[150%] -left-[150%] w-[400%] h-[400%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(34,197,94,0.05)_50%,transparent_100%)] pointer-events-none"
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      New Insights
                    </p>
                    <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">A new competitor has just entered the European energy sector that might impact Section 03.</p>
                  
                  <motion.button 
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50"
                  >
                    <motion.div
                      animate={isRegenerating ? { rotate: -360 } : {}}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    {isRegenerating ? "Regenerating..." : "Re-Generate Section"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </aside>
      </div>
    </div>
  );
}
