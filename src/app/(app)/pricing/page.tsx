'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle, XCircle, ChevronRight, TrendingUp, Cpu, Building2, Leaf, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAppStore } from "@/store/useAppStore";

export default function PricingPage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const [isAnnual, setIsAnnual] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [growthPrice, setGrowthPrice] = useState(99);
  const [starterPrice, setStarterPrice] = useState(29);
  const [enterprisePrice, setEnterprisePrice] = useState(499);

  // Sync state with AI generated prices when activeStartup changes
  useEffect(() => {
    if (activeStartup?.deepPricing) {
      setStarterPrice(activeStartup.deepPricing.starterPrice);
      setGrowthPrice(activeStartup.deepPricing.growthPrice);
      setEnterprisePrice(activeStartup.deepPricing.enterprisePrice || 499);
    }
  }, [activeStartup]);

  const handleSimulate = () => {
    setIsSimulating(true);
    if (typeof pendo !== 'undefined') {
      pendo.track("pricing_simulation_triggered", {
        startup_id: activeStartup?.id,
        startup_name: activeStartup?.name,
        billing_period: isAnnual ? "annual" : "monthly",
        starter_price: starterPrice,
        growth_price: growthPrice,
        enterprise_price: enterprisePrice,
      });
    }
    setTimeout(() => {
      // Simulate re-calibration
      setIsSimulating(false);
    }, 1000);
  };

  const currentStarter = isAnnual ? Math.floor(starterPrice * 0.8) : starterPrice;
  const currentGrowth = isAnnual ? Math.floor(growthPrice * 0.8) : growthPrice;
  const currentEnterprise = isAnnual ? Math.floor(enterprisePrice * 0.8) : enterprisePrice;
  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto w-full relative">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30"></div>

      <header className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/60 mb-2 uppercase tracking-widest">
            <span>Analysis</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary/80">Pricing Strategy</span>
          </nav>
          <h2 className="font-heading text-4xl font-bold text-foreground">Optimal Pricing Engine</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">AI-driven monetization modeling based on competitor teardowns, market willingness-to-pay, and SaaS best practices.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-full border border-white/10 bg-black/20 font-semibold text-foreground hover:bg-white/5 transition-colors">
            Export Model
          </button>
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            {isSimulating ? "Simulating Scenarios..." : "Re-simulate Analysis"}
          </button>
        </div>
      </header>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-black/30 p-1.5 rounded-full border border-white/10 flex items-center gap-1 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all z-10 ${!isAnnual ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${isAnnual ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Annually <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">Save 20%</span>
          </button>
          {/* Animated Highlight Pill */}
          <motion.div 
            className="absolute top-1.5 bottom-1.5 bg-primary rounded-full z-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            initial={false}
            animate={{ 
              width: isAnnual ? '54%' : '44%',
              left: isAnnual ? '45%' : '1.5%' 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
      </div>

      {/* Pricing Recommendation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        {/* Starter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -10 }}
        >
          <GlassCard className="rounded-[32px] p-8 flex flex-col relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)] h-full border-white/5 hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Leaf className="w-10 h-10" />
            </div>
            <h3 className="font-heading text-2xl font-semibold mb-2 text-foreground">Starter</h3>
            <p className="text-muted-foreground text-sm mb-6">Optimized for early traction and user feedback loops.</p>
            <div className="mb-8 flex items-baseline">
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={currentStarter}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-4xl font-black text-foreground"
                >
                  ${currentStarter}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground ml-1">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <CheckCircle className="text-primary w-5 h-5" /> Up to 3 users
              </li>
              <li className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <CheckCircle className="text-primary w-5 h-5" /> Basic Analytics
              </li>
              <li className="flex items-center gap-3 text-muted-foreground/40 line-through">
                <XCircle className="w-5 h-5" /> API Access
              </li>
            </ul>
            <div className="pt-6 border-t border-white/10 group-hover:border-primary/20 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Conversion Prob.</span>
                <span className="text-sm font-bold text-secondary">High (84%)</span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden border border-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-secondary"></motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Growth (Featured) */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1.05 }}
          transition={{ duration: 0.6, type: "spring" }}
          whileHover={{ scale: 1.08 }}
          className="z-10"
        >
          <div className="bg-gradient-to-br from-primary via-emerald-500 to-[#15846e] rounded-[32px] p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.4)] text-primary-foreground h-full border border-white/20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none"
            />
            <div className="mb-4 relative z-10">
              <span className="bg-white/20 px-4 py-1.5 rounded-full font-bold text-[10px] backdrop-blur-md border border-white/20 shadow-lg">RECOMMENDED MODEL</span>
            </div>
            <h3 className="font-heading text-2xl font-semibold mb-2 relative z-10">Growth</h3>
            <p className="text-white/80 text-sm mb-6 relative z-10">Engineered for scaling startups with heavy validation needs.</p>
            <div className="mb-8 flex items-baseline relative z-10">
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={currentGrowth}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="text-6xl font-black tracking-tighter drop-shadow-md"
                >
                  ${currentGrowth}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/80 font-bold ml-1 text-lg">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1 relative z-10">
              <li className="flex items-center gap-3 text-white font-medium">
                <CheckCircle className="w-5 h-5 fill-white/20" /> Unlimited seats
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                <CheckCircle className="w-5 h-5 fill-white/20" /> Full Competitive Intel
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                <CheckCircle className="w-5 h-5 fill-white/20" /> Custom AI Insights
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                <CheckCircle className="w-5 h-5 fill-white/20" /> Priority Webhooks
              </li>
            </ul>
            <div className="pt-6 border-t border-white/20 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-tighter text-white/80 font-bold drop-shadow-md">Conversion Prob.</span>
                <span className="text-sm font-bold text-white drop-shadow-md">Optimal (92%)</span>
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 2, delay: 0.8 }} className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] relative overflow-hidden">
                  <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enterprise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -10 }}
        >
          <GlassCard className="rounded-[32px] p-8 flex flex-col relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)] h-full border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 group-hover:text-indigo-400 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110">
              <Building2 className="w-10 h-10" />
            </div>
            <h3 className="font-heading text-2xl font-semibold mb-2 text-foreground">Enterprise</h3>
            <p className="text-muted-foreground text-sm mb-6">For large scale venture teams and innovation hubs.</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-[14px] font-bold text-muted-foreground mr-1">Starts at</span>
              <span className="font-heading text-5xl font-black text-foreground">${currentEnterprise}</span>
              <span className="text-muted-foreground font-semibold ml-2">/mo</span>
            </div>
            
            <button className="w-full py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors mb-8 group">
              Contact Sales <ChevronRight className="inline w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <CheckCircle className="text-indigo-400 w-5 h-5" /> White-label Reporting
              </li>
              <li className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <CheckCircle className="text-indigo-400 w-5 h-5" /> SSO & SAML Security
              </li>
              <li className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <CheckCircle className="text-indigo-400 w-5 h-5" /> Dedicated Account Lead
              </li>
            </ul>
            <div className="pt-6 border-t border-white/10 group-hover:border-indigo-500/20 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Conversion Prob.</span>
                <span className="text-sm font-bold text-muted-foreground group-hover:text-indigo-300 transition-colors">Moderate (45%)</span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden border border-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ duration: 1.5, delay: 1.1 }} className="h-full bg-indigo-500/60 group-hover:bg-indigo-400 transition-colors"></motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Revenue Projection & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MRR Projection Chart */}
        <GlassCard className="lg:col-span-8 rounded-[32px] p-8 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h4 className="font-heading text-2xl font-semibold mb-1 text-foreground">Estimated MRR Growth</h4>
              <p className="text-muted-foreground text-sm">Projected revenue based on Growth-tier optimization (12 Months)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400"></div>
                <span className="text-xs font-semibold text-muted-foreground">Baseline</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <div className="w-3 h-3 rounded-full bg-gradient-to-t from-[#22c55e] to-[#06b6d4] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-xs font-semibold text-primary">Optimized</span>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] w-full flex items-end justify-between px-2" style={{ maskImage: "linear-gradient(to top, transparent, black 20%)" }}>
            {/* Colorful background glows */}
            <div className="absolute top-0 right-10 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="absolute inset-0 flex items-end justify-between px-2 pt-16 pointer-events-none z-10">
              <div className="w-full h-full border-b border-white/5 border-dashed flex items-end justify-between pb-2">
                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, i) => {
                  const baseH = 20 + i * 3 + Math.sin(i) * 2;
                  const optH = 22 + i * 5 + Math.sin(i) * 4;
                  const baseColor = "bg-gradient-to-t from-indigo-900/60 to-indigo-500/60 border border-indigo-400/20";
                  const optColor = "bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-white/20";
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center justify-end gap-3 group h-full">
                      <div className="relative w-8 h-full flex items-end justify-center gap-1">
                        <motion.div initial={{ height: 0 }} animate={{ height: `${baseH}%` }} transition={{ duration: 1, delay: i * 0.05 }} className={`w-3 ${baseColor} rounded-t-md relative`}></motion.div>
                        <motion.div initial={{ height: 0 }} animate={{ height: `${optH}%` }} transition={{ duration: 1.5, delay: i * 0.05 + 0.3, type: "spring" }} className={`w-3 ${optColor} rounded-t-md relative transition-all group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] z-10`}></motion.div>
                      </div>
                      <span className="text-[10px] text-muted-foreground/40 font-bold group-hover:text-primary transition-colors">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Data overlays */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-0 right-0 p-5 bg-black/40 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl z-20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-cyan-500/10 opacity-50"></div>
              <div className="relative z-10">
                <div className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider mb-1">Projected ARR</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-md">
                  $<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{((currentGrowth * 100 * 12) / 1000000).toFixed(1)}</motion.span>M
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 mt-2 font-bold bg-emerald-500/10 px-2 py-1 rounded-md inline-flex border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> +24% vs. Competitors
                </div>
              </div>
            </motion.div>
          </div>
        </GlassCard>

        {/* Competitor Comparison Snapshot */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <GlassCard className="rounded-[32px] p-6 flex-1 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
            <h4 className="font-heading text-xl font-semibold mb-6 text-foreground">Price Benchmarks</h4>
            <div className="space-y-6">
              {[
                { title: "Main Competitor", desc: "Avg. Growth Tier", price: 149, badge: "Overpriced", icon: Building2, color: "text-destructive", badgeColor: "text-red-400 bg-red-500/10 px-2 py-1 rounded-full", bg: "bg-black/20 border-white/5", iconColor: "text-muted-foreground" },
                { title: "Market Average", desc: "Similar Features", price: 115, badge: "Baseline", icon: Cpu, color: "text-muted-foreground", badgeColor: "text-muted-foreground bg-white/5 px-2 py-1 rounded-full", bg: "bg-black/20 border-white/5", iconColor: "text-muted-foreground" },
                { title: "LaunchLens Rec.", desc: "Max Adoption", price: currentGrowth, badge: "Disruptive", icon: TrendingUp, color: "text-primary", badgeColor: "text-emerald-950 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] px-2 py-1 rounded-full", bg: "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-primary/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]", iconColor: "text-emerald-400" }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.2) }}
                  className="flex items-center justify-between group hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${item.bg}`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${item.title === 'LaunchLens Rec.' ? 'text-primary' : 'text-foreground'}`}>{item.title}</p>
                      <p className="text-muted-foreground text-[12px]">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.title === 'LaunchLens Rec.' ? 'text-primary' : 'text-foreground'}`}>
                      ${item.price}
                    </p>
                    <p className={`${item.badgeColor} text-[10px] font-semibold`}>{item.badge}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="rounded-[32px] p-6 bg-primary/5 border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>
            <div className="flex items-start gap-3 mb-4 relative z-10">
              <Cpu className="text-primary w-6 h-6 shrink-0" />
              <h4 className="font-heading text-lg font-semibold leading-tight text-foreground">Pricing Insight</h4>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium relative z-10">
              Setting your Growth tier at <strong className="text-primary font-bold bg-primary/10 px-1 rounded">${currentGrowth}</strong> creates a strong psychological "double-digit" anchor, increasing checkout conversion by an estimated <strong className="text-secondary font-bold">18.4%</strong> compared to the $115 market average.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Psychology & Insight */}
      <section className="mb-16">
        <GlassCard className="p-8 border-l-4 border-l-primary flex gap-6 items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Cpu className="text-primary w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading text-xl font-bold text-foreground mb-2">LaunchLens Pricing Insight</h4>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-4xl">
              {activeStartup?.deepPricing?.insight || "Your current monetization strategy leans too heavily on manual intervention. Our intelligence engine suggests raising your core tier by 20% to weed out high-support, low-value customers."}
            </p>
          </div>
        </GlassCard>
      </section>

      {/* Comparison Table */}
      <section className="mt-16">
        <motion.h4 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-2xl font-semibold mb-8 text-foreground"
        >
          Detailed Tier Comparison
        </motion.h4>
        <GlassCard className="rounded-[32px] overflow-hidden shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)] relative">
          <div className="absolute top-0 bottom-0 left-[50%] w-[25%] bg-gradient-to-b from-primary/10 via-emerald-500/5 to-transparent pointer-events-none hidden md:block"></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/40 border-b border-white/10">
                  <th className="p-6 font-heading text-base text-muted-foreground w-1/4">Feature Set</th>
                  <th className="p-6 font-heading text-base text-foreground w-1/4">Starter</th>
                  <th className="p-6 font-heading text-base text-primary w-1/4 bg-primary/5 border-x border-primary/20 relative">
                    <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    Growth
                  </th>
                  <th className="p-6 font-heading text-base text-foreground w-1/4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(activeStartup?.deepPricing?.features || []).map((row, i) => (
                  <motion.tr 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6 text-muted-foreground text-sm font-semibold group-hover:text-foreground transition-colors">{row.feature}</td>
                    
                    {/* Starter Column */}
                    <td className="p-6 text-foreground font-medium">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <CheckCircle className="w-5 h-5 text-muted-foreground" /> : <div className="w-4 h-0.5 bg-white/10 rounded-full"></div>
                      ) : row.starter}
                    </td>

                    {/* Growth Column (Highlighted) */}
                    <td className="p-6 text-primary font-bold bg-primary/5 border-x border-primary/10 relative transition-colors group-hover:bg-primary/10">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? (
                          <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                            <CheckCircle className="w-5 h-5 fill-primary/20 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          </motion.div>
                        ) : <div className="w-4 h-0.5 bg-primary/20 rounded-full"></div>
                      ) : (
                        <span className="drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">{row.growth}</span>
                      )}
                    </td>

                    {/* Enterprise Column */}
                    <td className="p-6 text-foreground font-medium">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <CheckCircle className="w-5 h-5 text-indigo-400" /> : <div className="w-4 h-0.5 bg-white/10 rounded-full"></div>
                      ) : row.enterprise}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {(!activeStartup?.deepPricing || !activeStartup.deepPricing.features) && (
              <div className="p-12 text-center text-muted-foreground">
                Generate a startup validation first to see detailed pricing features.
              </div>
            )}
          </div>
        </GlassCard>
      </section>

      <div className="h-12"></div>
    </div>
  );
}
