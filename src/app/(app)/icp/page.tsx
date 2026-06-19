'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, DollarSign, ShoppingCart, TrendingUp, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function ICPPage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const [radialValue, setRadialValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setRadialValue(85), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-12 space-y-12 flex-1 relative max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <h2 className="font-heading text-4xl font-semibold text-foreground mb-2">Ideal Customer Profile</h2>
        <p className="text-muted-foreground">Defining your high-value segment through venture-grade intelligence.</p>
      </header>

      {/* Primary Persona Spotlight */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
        {/* Spotlight Hero Card */}
        <GlassCard className="col-span-1 lg:col-span-8 p-8 flex flex-col relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(75,226,119,0.15),transparent)] -z-0 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/30">Primary Persona</span>
                <h3 className="font-heading text-4xl font-bold text-foreground mt-2">{activeStartup?.primaryICP?.title || "The High-Growth Founder"}</h3>
                <p className="text-muted-foreground text-lg max-w-md mt-2">{activeStartup?.primaryICP?.description || "Series A founders focused on operational efficiency."}</p>
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="hidden sm:flex w-32 h-32 rounded-3xl overflow-hidden border border-white/10 rotate-3 group-hover:rotate-0 transition-all duration-500 shrink-0 shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-gradient-to-br from-emerald-500/40 to-teal-900/80 items-center justify-center backdrop-blur-xl relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent)]"></div>
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeStartup?.primaryICP?.title || "Consumer")}&backgroundColor=transparent`} 
                  alt="Persona Avatar" 
                  className="w-24 h-24 drop-shadow-2xl z-10"
                />
              </motion.div>
            </div>
            
            <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-[12px] font-medium uppercase mb-1">Occupation</p>
                <p className="font-heading text-lg font-semibold text-primary">{activeStartup?.deepIcp?.demographics?.occupation || "Executive"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-[12px] font-medium uppercase mb-1">Age Range</p>
                <p className="font-heading text-2xl font-semibold text-primary">{activeStartup?.deepIcp?.demographics?.age || "35-50"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-[12px] font-medium uppercase mb-1">Location</p>
                <p className="font-heading text-lg font-semibold text-primary">{activeStartup?.deepIcp?.demographics?.location || "Urban"}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Market Alignment Radial */}
        <GlassCard className="col-span-1 lg:col-span-4 p-8 flex flex-col items-center justify-center text-center shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
          <h4 className="font-semibold text-xs text-muted-foreground mb-8 uppercase tracking-wider">Product-Market Fit Score</h4>
          
          <div className="relative mb-8 w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="icpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="16"></circle>
              <motion.circle 
                cx="96" cy="96" fill="transparent" r="80" stroke="url(#icpGradient)" 
                strokeDasharray="502.4" strokeDashoffset="150" strokeWidth="16"
                initial={{ strokeDashoffset: 502.4 }}
                animate={{ strokeDashoffset: 502.4 - (502.4 * radialValue) / 100 }}
                transition={{ duration: 2, ease: "easeOut", type: "spring", bounce: 0.3 }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-600 drop-shadow-sm">{radialValue}%</span>
            </div>
            <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse pointer-events-none"></div>
          </div>
          
          <p className="text-foreground px-4 font-medium">Exceptional alignment with core features and current roadmap priorities.</p>
        </GlassCard>
      </section>

      {/* Metrics Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pain Points Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <GlassCard className="p-8 border-t-4 border-t-orange-500 h-full hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-shadow duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-[inset_0_0_15px_rgba(249,115,22,0.2)]">
                <AlertTriangle className="text-orange-400 w-5 h-5" />
              </div>
              <h4 className="font-heading text-2xl font-semibold text-foreground">Pain Points</h4>
            </div>
            <motion.ul 
              initial="hidden" animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="space-y-4"
            >
              {[activeStartup?.primaryICP?.painPoint || "Struggling with data fragmentation.", ...(activeStartup?.deepIcp?.psychographics?.fears || [])].slice(0, 3).map((point, idx) => (
                <motion.li 
                  key={idx} 
                  variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.8)] group-hover:scale-150 transition-transform"></div>
                  <span className="text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </GlassCard>
        </motion.div>

        {/* Budget Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <GlassCard className="p-8 border-t-4 border-t-primary h-full hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-shadow duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]">
                <DollarSign className="text-primary w-5 h-5" />
              </div>
              <h4 className="font-heading text-2xl font-semibold text-foreground">Budget Range</h4>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground text-sm font-semibold">Willingness to Pay</span>
                  <span className="text-primary font-black text-sm drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{activeStartup?.primaryICP?.budget || "$45k - $120k"}</span>
                </div>
                <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                  </motion.div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-5">
                This segment demonstrates an <strong className="text-foreground">ideal purchasing power</strong> categorized within the <strong className="text-primary">{activeStartup?.deepIcp?.demographics?.income || "High"}</strong> income bracket, indicating strong monetization potential.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Buying Behavior */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <GlassCard className="p-8 border-t-4 border-t-secondary h-full hover:shadow-[0_0_30px_rgba(153,212,174,0.15)] transition-shadow duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-[inset_0_0_15px_rgba(153,212,174,0.2)]">
                <ShoppingCart className="text-secondary w-5 h-5" />
              </div>
              <h4 className="font-heading text-2xl font-semibold text-foreground">Psychographics</h4>
            </div>
            <motion.div 
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-wrap gap-2"
            >
              {(activeStartup?.deepIcp?.psychographics?.values || []).map((val, idx) => (
                <motion.span 
                  key={idx} 
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="px-4 py-1.5 bg-secondary/10 rounded-full border border-secondary/30 text-xs font-bold text-secondary drop-shadow-md hover:bg-secondary/20 cursor-default transition-colors"
                >
                  {val}
                </motion.span>
              ))}
            </motion.div>
            <div className="mt-8 p-5 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl border border-secondary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors"></div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className="text-secondary font-black text-xs uppercase tracking-widest bg-secondary/10 px-2 py-1 rounded-md">Primary Goal</span>
              </div>
              <p className="text-foreground text-sm font-medium leading-relaxed relative z-10">
                Ultimately driven to achieve <strong className="text-secondary">{(activeStartup?.deepIcp?.psychographics?.goals?.[0] || "Operational Efficiency").toLowerCase()}</strong> in their daily lives.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Persona Segments */}
      <section>
        <h4 className="font-heading text-2xl font-semibold text-foreground mb-8">Secondary Segments</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Primary Adopters", desc: `Driven by a core need for ${activeStartup?.deepIcp?.psychographics?.goals?.[0]?.toLowerCase() || 'efficiency'}.`, match: "82% Match", icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-400/30", gradient: "from-indigo-500/10 hover:from-indigo-500/20" },
            { title: "Adjacent Market", desc: `Attracted by the promise of ${activeStartup?.deepIcp?.psychographics?.values?.[0]?.toLowerCase() || 'quality'}.`, match: "64% Match", icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-400/30", gradient: "from-pink-500/10 hover:from-pink-500/20" },
            { title: "Niche Targets", desc: `Looking for solutions to mitigate ${activeStartup?.deepIcp?.psychographics?.fears?.[0]?.toLowerCase() || 'risk mitigation'}.`, match: "41% Match", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/30", gradient: "from-amber-500/10 hover:from-amber-500/20" },
            { title: "Late Majority", desc: "Waiting for widespread mainstream appeal before adopting.", match: "28% Match", icon: ArrowRight, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-400/30", gradient: "from-cyan-500/10 hover:from-cyan-500/20" }
          ].map((segment, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6, type: 'spring', bounce: 0.4 }}
              className="h-full"
            >
              <GlassCard className={`h-full flex flex-col p-6 bg-gradient-to-br to-transparent transition-all duration-300 ${segment.gradient} hover:scale-[1.03] hover:shadow-2xl group cursor-pointer`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 border ${segment.border} ${segment.bg}`}>
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1] }} 
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }} 
                    className={`w-3 h-3 rounded-full ${segment.bg} group-hover:scale-[2] transition-transform duration-500`}
                  ></motion.div>
                </div>
                <h5 className="text-foreground font-heading text-lg font-bold mb-2 group-hover:text-white transition-colors">{segment.title}</h5>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">{segment.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className={`${segment.color} font-bold text-xs bg-black/20 px-3 py-1.5 rounded-full border border-white/5`}>{segment.match}</span>
                  <segment.icon className={`${segment.color} w-5 h-5 group-hover:translate-x-1 transition-transform`} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
      
      <div className="h-12"></div>
    </div>
  );
}
