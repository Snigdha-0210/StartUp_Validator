'use client';

import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusChip } from "@/components/ui/StatusChip";
import { MarketTrendChart } from "@/components/ui/MarketTrendChart";
import { Download, Upload, AlertTriangle, TrendingUp, Handshake, MoreVertical, Loader2, Sparkles, Activity, ShieldCheck } from "lucide-react";
import { generateGroqMarketSignals } from "@/app/actions";
import { useState } from "react";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

export default function DashboardPage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const updateStartupScores = useAppStore(state => state.updateStartupScores);
  const [scanning, setScanning] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  if (!activeStartup) return null;

  const exportToPDF = async () => {
    setIsExportingPDF(true);
    try {
      const dashboardElement = document.getElementById("dashboard-export-area");
      if (!dashboardElement) return;

      // Temporarily hide the action buttons
      const buttonsContainer = document.getElementById("export-actions-container");
      if (buttonsContainer) buttonsContainer.style.display = 'none';

      const imgData = await htmlToImage.toPng(dashboardElement, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#020617", // slate-950
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
      pdf.save(`${activeStartup.name.replace(/\s+/g, '_')}_Venture_Report.pdf`);
    } catch (error) {
      console.error("Failed to export PDF", error);
    }
    setIsExportingPDF(false);
  };

  const handleScan = async () => {
    if (!activeStartup) return;
    setScanning(true);
    try {
      const res = await generateGroqMarketSignals(activeStartup.description);
      if (res.success && res.data) {
        updateStartupScores(activeStartup.id, {
          marketScore: Math.round(res.data.market_score * 10),
          productScore: Math.round(res.data.monetization_score * 10),
          teamScore: Math.round(res.data.execution_score * 10),
          overallScore: Math.round(((res.data.market_score + res.data.monetization_score + res.data.execution_score) / 3) * 10)
        });
      }
    } catch (e) {
      console.error(e);
    }
    setScanning(false);
  };

  return (
    <div id="dashboard-export-area" className="p-12 space-y-6 max-w-7xl mx-auto w-full bg-background">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-heading text-3xl font-semibold text-foreground mb-1">Project: {activeStartup.name}</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            Last analysis completed 14 minutes ago. 
            <button onClick={handleScan} disabled={scanning} className="text-primary font-semibold hover:underline flex items-center gap-1 disabled:opacity-50">
              {scanning && <Loader2 className="w-3 h-3 animate-spin" />}
              {scanning ? "Scanning with Groq..." : "Re-scan now"}
            </button>
          </p>
        </div>
        <div id="export-actions-container" className="flex gap-3">
          <button onClick={exportToPDF} disabled={isExportingPDF} className="px-5 py-2.5 glass-panel-subtle font-medium text-foreground hover:bg-white/5 transition-all flex items-center gap-2">
            {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExportingPDF ? "Exporting..." : "Download PDF"}
          </button>
          <button className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl shadow-[0_4px_14px_rgba(34,197,94,0.39)] hover:scale-[1.02] transition-all">Export JSON</button>
        </div>
      </div>

      {/* Startup Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-8 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors duration-1000"></div>
          <div className="relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-48 h-48 rounded-full flex items-center justify-center p-4 relative" 
              style={{
                background: `radial-gradient(closest-side, #0B0F0C 79%, transparent 80% 100%), conic-gradient(#22c55e ${activeStartup.overallScore}%, #1a1b22 0)`
              }}
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] pointer-events-none"></div>
              <div className="bg-[#0d0e15] w-full h-full rounded-full flex flex-col items-center justify-center border border-white/5 relative z-10">
                <span className="font-heading text-5xl font-black colorful-text leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-primary">{(activeStartup.overallScore / 10).toFixed(1)}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">of 10</span>
              </div>
            </motion.div>
          </div>
          <div className="flex-1 space-y-6 z-10">
            <div>
              <h3 className="font-heading text-3xl font-black text-foreground mb-3 flex items-center gap-2">
                Startup Viability Score <Sparkles className="w-5 h-5 text-primary" />
              </h3>
              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed font-medium">
                {activeStartup.investorData?.thesis || activeStartup.description}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-1">Confidence</span>
                <span className="text-3xl font-black text-foreground">{activeStartup.investorData?.confidenceScore || 85}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-1">TAM</span>
                <span className="text-3xl font-black text-emerald-400">{activeStartup.investorData?.marketPotential?.tam || "$2B"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-2">Risk Rating</span>
                <StatusChip variant={activeStartup.riskLevel === 'Low' ? 'success' : activeStartup.riskLevel === 'Medium' ? 'warning' : 'error'}>
                  {activeStartup.riskLevel.toUpperCase()}
                </StatusChip>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-1">Moat Strength</span>
                <span className="text-xl font-bold text-foreground mt-1 truncate">{activeStartup.roastData?.marketSentiment?.moat?.substring(0,15) || "Average"}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <GlassCard className="p-6 border-glow hover:border-primary/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500 cursor-default group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="text-primary w-6 h-6" />
            </div>
            <span className="colorful-text font-heading text-3xl font-black">{(activeStartup.marketScore / 10).toFixed(1)}</span>
          </div>
          <h4 className="font-bold text-foreground mb-2 text-lg">Market Score</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">{activeStartup.roastData?.marketSentiment?.saturation || "High demand in the vertical with low direct entry barriers."}</p>
        </GlassCard>

        <GlassCard className="p-6 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500 cursor-default group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <Activity className="text-blue-400 w-6 h-6" />
            </div>
            <span className="text-foreground font-heading text-3xl font-black">{(activeStartup.productScore / 10).toFixed(1)}</span>
          </div>
          <h4 className="font-bold text-foreground mb-2 text-lg">Product Score</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">{activeStartup.roastData?.productStrategy?.description || "Strong technical execution and robust feature set."}</p>
        </GlassCard>

        <GlassCard className="p-6 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 cursor-default group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-purple-400 w-6 h-6" />
            </div>
            <span className="text-foreground font-heading text-3xl font-black">{(activeStartup.teamScore / 10).toFixed(1)}</span>
          </div>
          <h4 className="font-bold text-foreground mb-2 text-lg">Team Score</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">Led by {activeStartup.founder}. {activeStartup.investorData?.founderFit?.description || "High execution capability."}</p>
        </GlassCard>

        <GlassCard className="p-6 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 cursor-default group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="text-amber-400 w-6 h-6" />
            </div>
            <span className="text-foreground font-heading text-3xl font-black">{(activeStartup.overallScore / 10).toFixed(1)}</span>
          </div>
          <h4 className="font-bold text-foreground mb-2 text-lg">Overall Risk</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">{activeStartup.investorData?.riskProfile?.criticalConcern || "Overall strong indicators for successful growth phase."}</p>
        </GlassCard>
      </motion.div>

      {/* Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <GlassCard className="p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-medium text-foreground">Market Interest Trends</h3>
              <p className="text-xs text-muted-foreground">Interest volume over last 12 months</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
              <span className="text-[11px] text-muted-foreground uppercase font-bold">Projected</span>
            </div>
          </div>
          <div className="flex-1 relative w-full mt-4 h-full">
            <MarketTrendChart />
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard className="p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-medium text-foreground">Competitor Funding</h3>
              <p className="text-xs text-muted-foreground">Total Raised ($ Millions)</p>
            </div>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-end justify-between gap-3 mt-8 h-[250px] pb-4 px-2">
            {activeStartup.competitors?.map((comp, i) => {
              // Generate realistic-looking funding data
              const heights = [85, 60, 45, 30, 75];
              const funding = ["$1.2B", "$450M", "$120M", "$45M", "$800M"];
              const heightStr = heights[i % heights.length] + '%';
              
              return (
              <div key={comp.name} className="flex-1 flex flex-col items-center justify-end h-full gap-3 group">
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: heightStr, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.1 + i * 0.15, type: 'spring', bounce: 0.5 }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-slate-900 to-slate-800 border-x border-t border-slate-700/50 group-hover:to-slate-700 transition-all duration-500 cursor-pointer relative overflow-hidden flex items-end justify-center pb-3 shadow-lg" 
                  title={comp.threatLevel + " Threat"}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-slate-400 font-bold text-xs tracking-wider z-10">{funding[i % funding.length]}</span>
                </motion.div>
                <span className="text-[10px] font-bold uppercase truncate w-full text-center text-slate-500 group-hover:text-slate-300 transition-colors">
                  {comp.name}
                </span>
              </div>
            )})}
            
            {/* The Active Startup (YOU) */}
            <div className="flex-1 flex flex-col items-center justify-end h-full gap-3 group">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "25%", opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8, type: 'spring', bounce: 0.6 }}
                className="w-full rounded-t-xl bg-gradient-to-t from-emerald-900/40 via-emerald-600/60 to-emerald-400/90 border-x border-t border-emerald-400/60 relative shadow-[0_0_30px_rgba(52,211,153,0.4)] group-hover:shadow-[0_0_40px_rgba(52,211,153,0.6)] transition-all flex items-end justify-center pb-3 overflow-hidden" 
              >
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-emerald-400 font-black tracking-widest text-[11px] animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">YOU</div>
                <span className="text-white font-black text-xs tracking-wider z-10 drop-shadow-md">SEED</span>
              </motion.div>
              <span className="text-[10px] font-black uppercase truncate w-full text-center text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]">
                {activeStartup.name}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Insights Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <GlassCard className="p-5 flex items-center gap-5 bg-destructive/5 border-destructive/20 hover:border-destructive/40 transition-colors">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-destructive w-6 h-6" />
          </div>
          <div>
            <h5 className="text-foreground font-bold text-sm mb-1">Key Threat Detected</h5>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{activeStartup.investorData?.riskProfile?.criticalConcern || "Competitor filed 4 new patents in your IP area."}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-5 bg-primary/5 border-primary/20 hover:border-primary/40 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <TrendingUp className="text-primary w-6 h-6" />
          </div>
          <div>
            <h5 className="text-foreground font-bold text-sm mb-1">Growth Opportunity</h5>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Search volume for '{activeStartup.category}' up 42%.</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-5 bg-[#99d4ae]/5 border-[#99d4ae]/20 hover:border-[#99d4ae]/40 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#99d4ae]/10 flex items-center justify-center shrink-0">
            <Handshake className="text-[#99d4ae] w-6 h-6" />
          </div>
          <div>
            <h5 className="text-foreground font-bold text-sm mb-1">Investor Matching</h5>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Decision: {activeStartup.investorData?.decision === "YES" ? "Strong Proceed" : "Pass"}. {activeStartup.investorData?.tags?.[0] || "SEED"} phase ready.</p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="h-12"></div>
    </div>
  );
}
