'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle, Share, Download, ShieldAlert, ArrowRight, Home, Terminal, GitMerge, Rocket, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function DecisionPage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const investorData = activeStartup?.investorData;
  const isYes = investorData?.decision === 'YES';
  const colorScheme = isYes ? 'primary' : 'destructive';
  const hexColor = isYes ? '#22c55e' : '#ef4444';
  return (
    <div className="p-8 lg:p-12 space-y-12 pb-24 flex-1 relative max-w-6xl mx-auto w-full">
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-${colorScheme}/10 rounded-full blur-[160px]`}
        ></motion.div>
      </div>

      <div className="relative z-10 space-y-12">
        {/* Decision Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
            Analysis Complete
          </div>
          <h2 className="font-heading text-5xl md:text-6xl text-foreground font-bold tracking-tight">Venture Feasibility Verdict</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI engine has synthesized 14.2M data points across your market segment, competitors, and technical stack to reach a final determination.
          </p>
        </header>

        {/* Centered Decision Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Key Reasons */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="col-span-1 lg:col-span-3 flex flex-col gap-6"
          >
            <GlassCard className={`p-6 rounded-[24px] flex-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]`}>
              <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-tighter">Key Reasons</h3>
              <ul className="space-y-4">
                {(investorData?.thesisPoints || []).slice(0, 3).map((point, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="flex gap-3"
                  >
                    {isYes ? <CheckCircle className="text-primary shrink-0 w-5 h-5" /> : <XCircle className="text-destructive shrink-0 w-5 h-5" />}
                    <span className="text-foreground text-sm font-medium">{point.title}</span>
                  </motion.li>
                ))}
                {(!investorData?.thesisPoints || investorData.thesisPoints.length === 0) && (
                  <span className="text-muted-foreground text-sm">No thesis points available. Generate a report first.</span>
                )}
              </ul>
            </GlassCard>
            <GlassCard className={`p-6 rounded-[24px] bg-${colorScheme}/5 border-${colorScheme}/20 relative overflow-hidden group`}>
              <div className={`absolute top-0 right-0 w-16 h-16 bg-${colorScheme}/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
              <h3 className={`text-sm font-bold text-${colorScheme} mb-2 uppercase tracking-tighter relative z-10`}>Market Fit</h3>
              <div className="text-4xl font-heading font-bold text-foreground mb-1 relative z-10">{activeStartup?.marketScore || 0}%</div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative z-10 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeStartup?.marketScore || 0}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className={`h-full bg-${colorScheme} shadow-[0_0_10px_${hexColor}]`}
                ></motion.div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Center: Decision Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
            className="col-span-1 lg:col-span-6"
          >
            <div className="relative h-full group">
              {/* Glowing Aura */}
              <div className={`absolute inset-0 bg-${colorScheme}/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000`}></div>
              
              <GlassCard className={`h-full rounded-[32px] overflow-hidden flex flex-col items-center justify-center p-12 text-center relative z-10 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.02)] hover:border-${colorScheme}/30 transition-colors duration-500`}>
                <div className="space-y-2 mb-8">
                  <span className={`text-${colorScheme} text-sm font-bold uppercase tracking-[0.3em]`}>AI Verdict</span>
                  <motion.h2 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                    className={`font-heading text-6xl md:text-[80px] leading-tight font-black text-foreground drop-shadow-[0_0_30px_${hexColor}80]`}
                  >
                    {isYes ? '🟢 YES' : '🔴 NO'}
                  </motion.h2>
                </div>
                <p className="text-muted-foreground text-base max-w-md mb-12 font-medium leading-relaxed">
                  {investorData?.thesis || "Generate a validation report to see the AI's final investment thesis."}
                </p>
                <div className={`px-12 py-5 bg-${colorScheme}/10 border border-${colorScheme}/30 text-${colorScheme} rounded-2xl font-heading text-2xl font-bold shadow-[0_0_30px_${hexColor}30] flex items-center gap-3`}>
                  {Math.round((investorData?.confidenceScore || 0) * 10)}% CONFIDENCE
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* Right: Confidence & Next Steps */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="col-span-1 lg:col-span-3 flex flex-col gap-6"
          >
            <GlassCard className={`p-6 rounded-[24px] text-center border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden group`}>
              <div className={`absolute top-0 left-0 w-16 h-16 bg-${colorScheme}/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
              <h3 className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-tighter relative z-10">Confidence Score</h3>
              <div className="text-6xl font-heading font-bold text-foreground mb-2 relative z-10">{investorData?.confidenceScore || 0}</div>
              <span className={`text-${colorScheme} text-[10px] font-bold bg-${colorScheme}/10 px-3 py-1 rounded-full border border-${colorScheme}/20 uppercase tracking-widest relative z-10 shadow-[0_0_10px_${hexColor}40]`}>
                {investorData?.confidenceScore && investorData.confidenceScore > 8 ? "Extreme Conviction" : "Moderate Conviction"}
              </span>
            </GlassCard>
            
            <GlassCard className={`p-6 rounded-[24px] flex-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]`}>
              <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-tighter">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(investorData?.tags || []).map((tag, idx) => (
                  <motion.span 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + (idx * 0.1) }}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Action Plan Roadmap */}
        <section className="relative overflow-hidden">
          <GlassCard className="rounded-[32px] p-8 lg:p-12 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none"></div>
            <div className="flex justify-between items-end mb-12 relative z-10">
              <div>
                <h3 className="font-heading text-3xl font-semibold text-foreground mb-2">Strategic Action Plan</h3>
                <p className="text-muted-foreground font-medium">Priority execution roadmap for the first 90 days.</p>
              </div>
              <div className="hidden md:flex gap-4">
                <button className="p-3 bg-black/20 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                  <Share className="w-5 h-5 text-foreground" />
                </button>
                <button className="p-3 bg-black/20 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                  <Download className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Horizontal Line (Desktop only) */}
              <div className="hidden md:block absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/50 to-primary/0 z-0"></div>

              {/* Steps */}
              {[
                { icon: Home, title: "Foundations", desc: "Week 1-2: Legal structure, core brand identity, and domain acquisition.", color: "bg-primary text-primary-foreground", shadow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]", border: "" },
                { icon: Terminal, title: "Alpha Build", desc: "Week 3-6: Development of Minimum Viable Product core features.", color: "bg-black/20 text-primary", shadow: "", border: "border border-primary/40" },
                { icon: GitMerge, title: "Beta Cohort", desc: "Week 7-10: Onboarding 10 selected design partners for iteration.", color: "bg-black/20 text-primary/70", shadow: "", border: "border border-primary/20" },
                { icon: Rocket, title: "Public Pilot", desc: "Week 12: Broad market entry and first revenue event.", color: "bg-black/20 text-primary/40", shadow: "", border: "border border-primary/10" }
              ].map((step, i) => (
                <div key={i} className="relative z-10 space-y-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${step.color} ${step.border} ${step.shadow}`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-semibold text-foreground mb-1">{step.title}</h4>
                    <p className="text-muted-foreground text-sm font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Final Risk Warning */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between p-6 bg-destructive/5 rounded-2xl border border-destructive/20 gap-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0 border border-destructive/20 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg mb-1">Critical Market Risk Alert</p>
              <p className="text-muted-foreground text-sm font-medium">
                {investorData?.riskProfile?.criticalConcern || "No critical concerns detected."}
              </p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-bold transition-colors whitespace-nowrap bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 relative z-10">
            View Mitigation Plan <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
