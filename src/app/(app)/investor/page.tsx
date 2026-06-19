'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle, History, Globe, AlertTriangle, Users, Award, Loader2, FileText, Download, X, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

import { useAppStore } from "@/store/useAppStore";

export default function InvestorModePage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const investorData = activeStartup?.investorData;
  const isYes = investorData?.decision === 'YES';
  const colorScheme = isYes ? 'primary' : 'destructive';

  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [isDiligenceModalOpen, setIsDiligenceModalOpen] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isDiligenceModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isDiligenceModalOpen]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("investor-export-area");
      if (!element) return;
      
      const buttonsContainer = document.getElementById("investor-actions-container");
      if (buttonsContainer) buttonsContainer.style.display = 'none';

      const imgData = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#020617",
      });

      if (buttonsContainer) buttonsContainer.style.display = 'flex';

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const fileName = `${activeStartup?.name?.replace(/\s+/g, '_') || 'Startup'}_Investor_Report.pdf`;
      pdf.save(fileName);

      if (typeof pendo !== 'undefined') {
        pendo.track("investor_report_downloaded", {
          startup_id: activeStartup?.id,
          startup_name: activeStartup?.name,
          investment_decision: investorData?.decision,
          confidence_score: investorData?.confidenceScore,
          file_name: fileName,
          format: "PDF",
        });
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to export PDF", error);
    }
    setIsDownloading(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const termSheetContent = `
TERM SHEET
Date: ${new Date().toLocaleDateString()}
Company: ${activeStartup?.name || "Startup"}
Founder: ${activeStartup?.founder || "Founder"}
Investment Decision: ${investorData?.decision || "YES"}
Confidence Score: ${investorData?.confidenceScore || 94}%

SUMMARY:
${investorData?.thesis || "High-conviction opportunity."}

RECOMMENDED ACTION:
${investorData?.decision === 'YES' ? "Proceed to DD Phase 2" : "Hard Pass"}

CONFIDENTIAL - LAUNCHLENS VENTURE INTELLIGENCE
      `.trim();

      const blob = new Blob([termSheetContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeStartup?.name?.replace(/\s+/g, '_') || 'Startup'}_Term_Sheet.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const termFileName = `${activeStartup?.name?.replace(/\s+/g, '_') || 'Startup'}_Term_Sheet.txt`;
      if (typeof pendo !== 'undefined') {
        pendo.track("term_sheet_generated", {
          startup_id: activeStartup?.id,
          startup_name: activeStartup?.name,
          investment_decision: investorData?.decision,
          confidence_score: investorData?.confidenceScore,
          founder: activeStartup?.founder,
          file_name: termFileName,
        });
      }

      setIsGenerating(false);
      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div id="investor-export-area" className="p-8 lg:p-12 space-y-8 flex-1 relative max-w-[1200px] mx-auto w-full text-foreground overflow-x-hidden">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Internal Terminal v4.2.0</span>
          <h2 className="font-heading text-5xl md:text-6xl font-bold tracking-tight leading-none text-foreground">Would We Invest?</h2>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground/60 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            Live Analysis Active
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div>REF ID: LX-8821-INV</div>
        </div>
      </header>

      {/* Grid Layout: Decision & Core Thesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Decision Card (YES) */}
        <GlassCard className="col-span-1 lg:col-span-5 rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 blur-[80px] group-hover:bg-primary/20 transition-all duration-1000 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <p className="text-muted-foreground font-medium tracking-wide">LL AI DECISION ENGINE</p>
              <CheckCircle className="text-primary w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className={`${isYes ? 'text-primary' : 'text-destructive'} font-heading text-8xl md:text-[120px] font-black leading-none tracking-tighter`}>{investorData?.decision || "YES"}</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-bold text-foreground">{investorData?.confidenceScore || 94}%</span>
                <span className="text-muted-foreground text-sm font-semibold uppercase">Confidence Score</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 pt-12 border-t border-white/5 mt-8">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">Recommended Action:</span>
              <span className={`${isYes ? 'text-primary' : 'text-destructive'} font-bold`}>{isYes ? "Proceed to DD Phase 2" : "Hard Pass"}</span>
            </div>
            <div className="mt-4 w-full h-1.5 bg-black/20 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${investorData?.confidenceScore || 94}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full ${isYes ? 'bg-primary shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-destructive shadow-[0_0_12px_rgba(239,68,68,0.5)]'}`}
              ></motion.div>
            </div>
          </div>
        </GlassCard>

        {/* Investment Thesis */}
        <GlassCard className="col-span-1 lg:col-span-7 rounded-[32px] p-8 flex flex-col shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
          <div className="flex items-center gap-3 mb-6">
            <History className="text-secondary w-6 h-6" />
            <h4 className="font-heading text-2xl font-semibold text-foreground">Investment Thesis</h4>
          </div>
          <div className="space-y-6 flex-1 text-muted-foreground text-base leading-relaxed">
            <p>{investorData?.thesis || "LaunchLens represents a high-conviction opportunity..."}</p>
            <ul className="space-y-4">
              {(investorData?.thesisPoints || [
                { title: "Unfair Data Advantage", description: "Proprietary scraping of 40+ developer and consumer signals." },
                { title: "Scalable Unit Economics", description: "LTV/CAC projection of 5.2x within 18 months." },
                { title: "Moat potential", description: "Network effects through a shared intelligence layer." }
              ]).map((point, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span><strong className="text-foreground">{point.title}:</strong> {point.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 flex-wrap">
            {(investorData?.tags || ["SAAS", "SEED", "LOW-MID"]).map((tag, idx) => (
              <div key={idx} className="px-4 py-2 bg-black/20 rounded-lg border border-white/10 text-xs font-mono font-semibold text-foreground uppercase">{tag}</div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bento Grid: Risk, Market, Founder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Market Potential */}
        <GlassCard className="col-span-1 lg:col-span-8 rounded-[32px] p-8 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Globe className="text-secondary w-6 h-6" />
              <h4 className="font-heading text-2xl font-semibold text-foreground">Market Potential</h4>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground text-xs font-semibold block tracking-widest uppercase">Est. Total Opportunity</span>
              <span className="font-heading text-2xl font-bold text-primary">{investorData?.marketPotential?.tam || "$12.4B"}</span>
            </div>
          </div>
          {/* Concentric Circle Visualization */}
          <div className="relative h-[300px] flex items-center justify-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="absolute w-[280px] h-[280px] rounded-full border border-primary/20 bg-primary/5 flex items-start justify-center pt-4">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">TAM {investorData?.marketPotential?.tam || "$12.4B"}</span>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute w-[180px] h-[180px] rounded-full border border-primary/40 bg-primary/10 flex items-start justify-center pt-4">
              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">SAM {investorData?.marketPotential?.sam || "$2.1B"}</span>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="absolute w-[100px] h-[100px] rounded-full bg-primary/30 border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-widest text-center">SOM<br/>{investorData?.marketPotential?.som || "$450M"}</span>
            </motion.div>
            
            {/* Legend */}
            <div className="absolute bottom-0 right-0 space-y-2 hidden sm:block">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/5 border border-primary/20 rounded-sm"></div>
                <span className="text-xs text-muted-foreground font-semibold">Global Analytics Market</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/10 border border-primary/40 rounded-sm"></div>
                <span className="text-xs text-muted-foreground font-semibold">SaaS Intelligence Vertical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/30 border border-primary rounded-sm"></div>
                <span className="text-xs text-muted-foreground font-semibold">TAM Focused Late-Stage</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Risk Analysis */}
        <GlassCard className="col-span-1 lg:col-span-4 rounded-[32px] p-8 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-destructive w-6 h-6" />
            <h4 className="font-heading text-2xl font-semibold text-foreground">Risk Profile</h4>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground font-semibold uppercase tracking-wider">Execution Risk</span>
                <span className="text-primary font-bold">{investorData?.riskProfile?.executionRisk || 12}%</span>
              </div>
              <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-primary" style={{ width: `${investorData?.riskProfile?.executionRisk || 12}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground font-semibold uppercase tracking-wider">Market Saturation</span>
                <span className="text-[#22c55e] font-bold">{investorData?.riskProfile?.marketSaturation || 45}%</span>
              </div>
              <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-[#22c55e]" style={{ width: `${investorData?.riskProfile?.marketSaturation || 45}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground font-semibold uppercase tracking-wider">Technical Moat</span>
                <span className="text-secondary font-bold">{investorData?.riskProfile?.technicalMoat || 22}%</span>
              </div>
              <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-secondary" style={{ width: `${investorData?.riskProfile?.technicalMoat || 22}%` }}></div>
              </div>
            </div>
          </div>
          <div className="mt-10 p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive font-semibold leading-tight">CRITICAL CONCERN: {investorData?.riskProfile?.criticalConcern || "High dependency on third party APIs."}</p>
          </div>
        </GlassCard>

        {/* Founder Fit */}
        <motion.div className="col-span-1 lg:col-span-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
          <GlassCard className={`rounded-[32px] p-8 overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border-white/10 group`}>
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-${colorScheme}/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-${colorScheme}/10 transition-colors duration-1000`}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Award className={`text-${colorScheme} w-7 h-7 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                  <h4 className="font-heading text-3xl font-semibold text-foreground">Founder Integrity & Fit</h4>
                </div>
                <div className="space-y-8">
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all">
                    <div className={`w-14 h-14 rounded-xl bg-${colorScheme}/20 flex items-center justify-center shrink-0 shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]`}>
                      <Users className={`text-${colorScheme} w-6 h-6`} />
                    </div>
                    <div>
                      <h5 className="font-bold text-foreground text-lg mb-1">Founder-Market Fit: <span className={`text-${colorScheme}`}>{investorData?.founderFit?.score || "9.8/10"}</span></h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">{investorData?.founderFit?.description || "Combined 20+ years in fintech and data analytics."}</p>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all">
                    <div className={`w-14 h-14 rounded-xl bg-${colorScheme}/20 flex items-center justify-center shrink-0 shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]`}>
                      <Globe className={`text-${colorScheme} w-6 h-6`} />
                    </div>
                    <div>
                      <h5 className="font-bold text-foreground text-lg mb-1">Technical Capability</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">{investorData?.founderFit?.capability || "In-house ML engineering team with LLM specialization."}</p>
                    </div>
                  </motion.div>
                  <button 
                    onClick={() => setIsDiligenceModalOpen(true)}
                    className={`mt-6 px-6 py-3 rounded-xl border border-${colorScheme}/30 hover:bg-${colorScheme}/10 transition-colors text-sm font-bold flex items-center gap-2 text-${colorScheme} shadow-[0_0_15px_rgba(34,197,94,0.1)]`}
                  >
                    View Diligence Log
                  </button>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="relative h-[300px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 bg-black/40 flex items-center justify-center"
              >
                {/* Dynamic Avatar based on Founder Name */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                <div className={`w-40 h-40 rounded-full border-4 border-${colorScheme}/40 overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-muted relative z-10 animate-bounce-slow`}>
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Founder Avatar" 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeStartup?.founder || "Felix"}&backgroundColor=b6e3f4`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c] via-transparent to-transparent z-0"></div>
                <div className="absolute bottom-6 left-6 z-10 w-full pr-12">
                  <div className="flex gap-3 mb-2">
                    <span className={`px-3 py-1.5 bg-${colorScheme} text-primary-foreground text-[10px] font-black rounded uppercase shadow-[0_0_10px_rgba(34,197,94,0.5)]`}>Verified History</span>
                    <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black rounded uppercase">Background Check: Clear</span>
                  </div>
                  <p className="text-white font-bold text-lg">{activeStartup?.founder || "Unknown Founder"}</p>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Action & Meta */}
      <footer className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-white/10 gap-6 mt-8">
        <p className="text-muted-foreground/40 text-xs font-mono max-w-xl">© 2024 LaunchLens Venture Intelligence. This report is strictly confidential and intended for authorized PE/VC partners only. ID: {activeStartup?.id}</p>
        <div id="investor-actions-container" className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleDownload}
            disabled={isDownloading || downloadSuccess}
            className={`flex items-center justify-center gap-2 w-48 py-3.5 rounded-2xl bg-black/40 border border-white/10 hover:bg-white/10 text-foreground font-bold text-sm transition-all disabled:opacity-50`}
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : downloadSuccess ? <CheckCircle className="w-4 h-4 text-primary" /> : <Download className="w-4 h-4" />}
            {isDownloading ? "Processing..." : downloadSuccess ? "Downloaded!" : "Download PDF"}
          </button>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || generateSuccess}
            className={`flex items-center justify-center gap-2 w-56 py-3.5 rounded-2xl bg-${colorScheme} text-primary-foreground font-bold text-sm active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:brightness-110 disabled:opacity-50 disabled:active:scale-100 disabled:hover:brightness-100`}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : generateSuccess ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {isGenerating ? "Drafting..." : generateSuccess ? "Term Sheet Ready!" : "Generate Term Sheet"}
          </button>
        </div>
      </footer>

      {/* Diligence Modal */}
      <AnimatePresence>
        {isDiligenceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDiligenceModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl"
            >
              <GlassCard className="p-8 rounded-[32px] border-white/10 shadow-2xl bg-[#0a0f12]/95 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="text-primary w-8 h-8" />
                      <h3 className="font-heading text-3xl font-bold text-foreground">Diligence Log</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">Automated Background & Integrity Verification</p>
                  </div>
                  <button 
                    onClick={() => setIsDiligenceModalOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-foreground font-bold mb-1">Identity & KYC Clearance</h4>
                      <p className="text-sm text-muted-foreground">Global watchlist scan clear. Identity verified via cryptographic hash match. No AML red flags detected.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-foreground font-bold mb-1">Corporate History</h4>
                      <p className="text-sm text-muted-foreground">No prior bankruptcies or hostile dissolutions found in jurisdictional records spanning 15 years.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-foreground font-bold mb-1">Social Media & Public Sentiment</h4>
                      <p className="text-sm text-muted-foreground">Generally positive. Minor controversy flagged in 2019 regarding an aggressive marketing campaign, resolved quickly. Risk: Low.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-foreground font-bold mb-1">IP & Patent Review</h4>
                      <p className="text-sm text-muted-foreground">No pending litigation against founder. 2 patents properly assigned to current corporate entity.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs font-mono text-muted-foreground">Log generated securely. ID: {activeStartup?.id}</span>
                  <button 
                    onClick={() => setIsDiligenceModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all"
                  >
                    Acknowledge
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
