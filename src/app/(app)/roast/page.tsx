'use client';

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertCircle, TrendingDown, Radar, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoastPage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const roastData = activeStartup?.roastData;
  
  const [intensity, setIntensity] = useState(2);
  const roastLevels = [
    { label: 'Mild', color: 'text-amber-400', barWidth: '33%', barColor: 'from-primary to-amber-400', borderColor: 'border-amber-400/50' },
    { label: 'Spicy', color: 'text-orange-500', barWidth: '66%', barColor: 'from-primary via-orange-400 to-orange-500', borderColor: 'border-orange-500/50' },
    { label: 'Brutal', color: 'text-red-500', barWidth: '100%', barColor: 'from-primary via-yellow-400 to-red-500', borderColor: 'border-red-500/80' },
  ];
  
  const currentData = roastLevels[intensity];

  const roastContent = {
    monetization: [
      { title: "Revenue Concerns", desc: "Your pricing strategy might need adjustment. It's unclear if the pain point is strong enough for consistent subscription revenue." },
      { title: "Weak Monetization", desc: "Users expect this kind of feature for free. Getting them to pay will be an uphill battle." },
      { title: "Why would users pay for this?", desc: "Your value proposition feels like a nice-to-have utility. Nobody is opening their wallet for this garbage." }
    ],
    strategy: [
      { title: "Feature Overlap", desc: "Consider focusing on a tighter niche to avoid direct competition with established players." },
      { title: "Me-Too Product", desc: "You are building features that competitors already have. Where is the actual innovation?" },
      { title: "Your differentiation is weak.", desc: `You're entering a crowded market with a me-too feature set. ${activeStartup?.name || 'This'} is a feature, not a company.` }
    ],
    landscape: [
      { title: "Competitive Market", desc: "Large incumbents have adjacent features that could easily expand into your territory." },
      { title: "Easily Replicated", desc: "Your core product is a weekend project for an incumbent's engineering team." },
      { title: "Existing tools replace you.", desc: "Notion just added this. Slack is building this. You have no technical moat whatsoever." }
    ],
    economics: [
      { title: "CAC vs LTV", desc: "Customer acquisition costs might be higher than expected in this channel." },
      { title: "Unprofitable Growth", desc: "You are spending too much to acquire low-value, high-churn users." },
      { title: "Acquisition is expensive.", desc: "Your LTV/CAC ratio is trending toward zero. This is a complete death spiral." }
    ]
  };

  const [fullLoading, setFullLoading] = useState(false);

  const handleBookVC = () => {
    pendo.track("vc_consultation_booked", {
      startup_id: activeStartup?.id,
      startup_name: activeStartup?.name,
      roast_intensity_level: roastLevels[intensity]?.label,
      overall_score: activeStartup?.overallScore,
      risk_level: activeStartup?.riskLevel,
    });
    window.location.href = "mailto:partners@launchlens.ai?subject=VC%20Consultation%20Booking";
  };

  const handleGenerateFull = () => {
    setFullLoading(true);
    setTimeout(() => {
      setFullLoading(false);
      pendo.track("full_roast_report_generated", {
        startup_id: activeStartup?.id,
        startup_name: activeStartup?.name,
        roast_intensity_level: roastLevels[intensity]?.label,
        has_roast_data: !!roastData,
      });
      alert("Full roast report generated and sent to your email!");
    }, 2000);
  };

  return (
    <div className="p-8 lg:p-12 flex-1 h-full overflow-y-auto relative max-w-[1440px] mx-auto w-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <span className={`inline-block bg-white/5 border border-white/10 ${currentData.color} px-3 py-1 text-xs font-bold uppercase tracking-tighter mb-4 transition-colors`}>Vulnerability Assessment</span>
          <h2 className="font-heading text-5xl md:text-6xl uppercase font-black leading-none tracking-tighter mb-4 text-foreground">ROAST MY <br/>STARTUP.</h2>
          <p className="text-lg text-muted-foreground max-w-lg font-medium mb-6">
            Our intelligence engine identified the fatal flaws in <strong className="text-foreground">{activeStartup?.name || "your startup"}</strong> that VCs are too polite to mention.
          </p>
        </div>
        
        {/* Intensity Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Roast Intensity</span>
          <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
            {roastLevels.map((level, idx) => (
              <button
                key={level.label}
                onClick={() => setIntensity(idx)}
                className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                  intensity === idx 
                    ? `bg-white/10 ${level.color} shadow-[0_0_15px_rgba(255,255,255,0.05)]` 
                    : 'text-muted-foreground hover:bg-white/5'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Heat Indicator */}
      <div className="w-full h-1 bg-black/20 border border-white/5 mb-16 flex overflow-hidden">
        <motion.div 
          className={`h-full bg-gradient-to-r ${currentData.barColor}`} 
          initial={false}
          animate={{ width: currentData.barWidth }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {roastData ? (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
        
        {/* Feedback Card 1 */}
        <div className="col-span-1 md:col-span-8 group">
          <GlassCard className={`p-10 border-2 ${currentData.borderColor} hover:bg-destructive/5 transition-colors duration-300 relative overflow-hidden h-full shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <AlertCircle className="w-32 h-32 text-destructive" strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <span className={`text-xs font-bold ${currentData.color} bg-white/5 border ${currentData.borderColor} px-2 py-1 mb-6 inline-block uppercase`}>Monetization Risk</span>
              <h3 className="font-heading text-3xl font-bold uppercase mb-6 leading-tight text-foreground">"{roastContent.monetization[intensity].title}"</h3>
              <p className="text-base text-muted-foreground mb-8 max-w-xl font-medium">
                {roastContent.monetization[intensity].desc}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-lg">
                  <TrendingDown className="text-destructive w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase">Willingness to Pay</p>
                  <p className={`font-heading text-2xl ${currentData.color} font-black`}>{intensity === 0 ? "6.5" : intensity === 1 ? "4.2" : "2.4"} / 10</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Secondary Metric Card */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <GlassCard className={`p-8 border-2 ${currentData.borderColor} h-full shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]`}>
            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-6 tracking-widest">Market Sentiment</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-base font-medium text-foreground">Saturation</span>
                <span className={`font-heading text-xl font-bold ${currentData.color}`}>{intensity === 0 ? "MEDIUM" : intensity === 1 ? "HIGH" : "CRITICAL"}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-base font-medium text-foreground">Moat</span>
                <span className="font-heading text-xl font-bold text-foreground">{intensity === 0 ? "WEAK" : intensity === 1 ? "SHALLOW" : "NONE"}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-base font-medium text-foreground">Viral Coefficient</span>
                <span className="font-heading text-xl font-bold text-secondary">{intensity === 0 ? "0.85" : intensity === 1 ? "0.4" : "0.12"}</span>
              </div>
            </div>
            <div className="mt-8">
              <div className="w-full aspect-square bg-[#0B0F0C] border border-white/5 relative flex items-center justify-center overflow-hidden rounded-xl">
                {/* Concentric rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-full border border-primary/20 absolute"></div>
                  <div className="w-1/2 h-1/2 rounded-full border border-primary/30 absolute"></div>
                  <div className="w-1/4 h-1/4 rounded-full border border-primary/40 absolute"></div>
                  {/* Crosshairs */}
                  <div className="w-full h-[1px] bg-primary/20 absolute"></div>
                  <div className="h-full w-[1px] bg-primary/20 absolute"></div>
                </div>

                {/* Sweeping Radar Hand */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 70%, rgba(34, 197, 94, 0.4) 100%)',
                  }}
                />

                {/* Pulsing Dots (simulating market signals) */}
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.5] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(34,197,94,1)]"
                />
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.5] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1.2 }}
                  className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,1)]"
                />
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.5] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 2 }}
                  className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(250,204,21,1)]"
                />

                <Radar className="w-8 h-8 text-primary relative z-10 opacity-50" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Feedback Card 2 */}
        <div className="col-span-1 md:col-span-4 group">
          <GlassCard className={`p-8 border-2 ${currentData.borderColor} hover:bg-white/5 transition-colors h-full shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]`}>
            <span className={`text-xs font-bold ${currentData.color} bg-white/5 border ${currentData.borderColor} px-2 py-1 mb-4 inline-block uppercase`}>Product Strategy</span>
            <h3 className="font-heading text-xl font-bold uppercase mb-4 text-foreground">"{roastContent.strategy[intensity].title}"</h3>
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              {roastContent.strategy[intensity].desc}
            </p>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-auto relative mb-6">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "25%" }} 
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
              <span>Feature Parity Gap</span>
              <span className="text-primary">25% Differentiation</span>
            </div>
          </GlassCard>
        </div>

        {/* Feedback Card 3 */}
        <div className="col-span-1 md:col-span-4 group">
          <GlassCard className={`p-8 border-2 ${currentData.borderColor} hover:bg-white/5 transition-colors h-full shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]`}>
            <span className={`text-xs font-bold ${currentData.color} bg-white/5 border ${currentData.borderColor} px-2 py-1 mb-4 inline-block uppercase`}>Landscape Audit</span>
            <h3 className="font-heading text-xl font-bold uppercase mb-4 text-foreground">"{roastContent.landscape[intensity].title}"</h3>
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              {roastContent.landscape[intensity].desc}
            </p>
            <div className="flex gap-2 flex-wrap mt-auto">
              {["NOTION", "SLACK", "LINEAR"].map((comp: string, i: number) => (
                <a 
                  key={i} 
                  href={`https://www.google.com/search?q=${encodeURIComponent(comp)}+startup+funding+OR+pricing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/20 text-muted-foreground px-3 py-1.5 text-[10px] font-bold border border-white/5 uppercase hover:border-indigo-400/50 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all cursor-pointer flex items-center gap-1 group"
                >
                  {comp}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">↗</span>
                </a>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Feedback Card 4 */}
        <div className="col-span-1 md:col-span-4 group">
          <GlassCard className={`p-8 border-2 ${currentData.borderColor} hover:bg-destructive/5 transition-colors h-full shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]`}>
            <span className={`text-xs font-bold ${currentData.color} bg-white/5 border ${currentData.borderColor} px-2 py-1 mb-4 inline-block uppercase`}>Unit Economics</span>
            <h3 className="font-heading text-xl font-bold uppercase mb-4 text-foreground">"{roastContent.economics[intensity].title}"</h3>
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              {roastContent.economics[intensity].desc}
            </p>
            <div className="mt-auto w-full">
              <div className="flex items-center gap-2 text-destructive font-black mb-6">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span className="text-sm">DEATH SPIRAL RISK</span>
              </div>
              <div className="w-full h-16 border-l border-b border-white/10 relative">
                {/* LTV dropping */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <motion.path 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M 0,20 Q 50,20 100,90" stroke="rgba(34,197,94,0.5)" strokeWidth="3" fill="none" 
                  />
                  {/* CAC rising */}
                  <motion.path 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M 0,90 Q 50,90 100,10" stroke="rgba(239,68,68,0.8)" strokeWidth="3" fill="none" 
                  />
                </svg>
                <div className="absolute top-1 left-2 text-[8px] text-primary/50 font-bold uppercase">LTV</div>
                <div className="absolute top-1 right-2 text-[8px] text-destructive/80 font-bold uppercase">CAC</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Large CTA Card */}
        <div className="col-span-1 md:col-span-12 mt-8">
          <GlassCard className="p-12 border-2 border-primary/20 text-center relative overflow-hidden shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
            <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay">
              <img 
                className="w-full h-full object-cover" 
                alt="VC Boardroom" 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
              />
            </div>
            <div className="relative z-10">
              <h3 className="font-heading text-4xl md:text-5xl uppercase mb-6 tracking-tighter font-bold text-foreground">Ready for the Full Audit?</h3>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
                Get a 50-page deep-dive report covering competitor feature parity, ghost-pricing strategies, and founder background checks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleGenerateFull}
                  disabled={fullLoading}
                  className="bg-primary text-primary-foreground font-bold px-12 py-5 text-sm uppercase tracking-widest border-2 border-primary hover:bg-transparent hover:text-primary transition-all rounded-none shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {fullLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Compiling Report...</> : "Generate Full Roast"}
                </button>
                <button 
                  onClick={handleBookVC}
                  className="bg-transparent text-foreground font-bold px-12 py-5 text-sm uppercase tracking-widest border-2 border-white/20 hover:bg-white hover:text-black transition-all rounded-none"
                >
                  Book VC Consultation
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        </motion.div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-medium">Generate a startup validation first to see the roast.</p>
        </div>
      )}

      <div className="h-12"></div>
    </div>
  );
}
