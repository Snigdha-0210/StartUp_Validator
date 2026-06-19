'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, ArrowRight, Rocket, CheckCircle, Lightbulb, Shield, Loader2, Cpu, Activity, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCompleteStartupProfile } from '@/app/actions/validateStartup';

export default function ValidationPage() {
  const router = useRouter();
  const { startups, setSelectedStartupId } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("Initializing Engine...");

  // Form State
  const [idea, setIdea] = useState("");
  const [severity, setSeverity] = useState(5.0);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [customerType, setCustomerType] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [unfairAdvantage, setUnfairAdvantage] = useState("");

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const toggleChip = (chip: string) => {
    setSelectedChips(prev => 
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate complex loading phases for UX
    const phases = [
      "Analyzing Market Density...",
      "Scraping Competitor Positioning...",
      "Simulating Unit Economics...",
      "Running Vulnerability Tests...",
      "Finalizing Venture Intelligence Report...",
      "Compiling 50-Page Report (Hang tight, this takes ~30s)...",
      "Validating JSON Schema...",
      "Finalizing Dashboard..."
    ];
    let phaseIdx = 0;
    const interval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % phases.length;
      setLoadingPhase(phases[phaseIdx]);
    }, 2500);

    try {
      // Call the Mega AI Action
      const res = await generateCompleteStartupProfile(idea, severity, targetMarket, unfairAdvantage, customerType, selectedChips);
      clearInterval(interval);
      
      if (res.success && res.data) {
        pendo.track("startup_validation_completed", {
          idea_length: idea.length,
          severity_score: severity,
          customer_type: customerType,
          target_market: targetMarket,
          unfair_advantage_length: unfairAdvantage.length,
          existing_solutions_selected: selectedChips.join(", "),
          existing_solutions_count: selectedChips.length,
          generated_startup_id: res.data.id,
          generated_startup_name: res.data.name,
          generated_category: res.data.category,
          generated_overall_score: res.data.overallScore,
          generated_risk_level: res.data.riskLevel,
        });
        useAppStore.getState().addGeneratedStartup(res.data);
        router.push('/dashboard');
      } else {
        pendo.track("startup_validation_failed", {
          error_message: String(res.error).substring(0, 200),
          idea_length: idea.length,
          severity_score: severity,
          customer_type: customerType,
          target_market: targetMarket,
          existing_solutions_count: selectedChips.length,
        });
        console.error(res.error);
        alert("Engine Overloaded. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      clearInterval(interval);
      pendo.track("startup_validation_failed", {
        error_message: String(err).substring(0, 200),
        idea_length: idea.length,
        severity_score: severity,
        customer_type: customerType,
        target_market: targetMarket,
        existing_solutions_count: selectedChips.length,
      });
      console.error(err);
      alert("Failed to analyze startup.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto py-16 px-6 w-full">
      {/* Header Section */}
      <header className="mb-12">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-xs mb-4 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md"
        >
          ENGINE v2.4
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 via-primary to-cyan-400 bg-clip-text text-transparent"
        >
          Validate Your Vision
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl"
        >
          Deploy our proprietary intelligence engine to stress-test your startup hypothesis against 2.5M market data points.
        </motion.p>
      </header>

      {/* Questionnaire UI Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <GlassCard className="p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden border border-white/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:opacity-50">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="flex gap-3">
              {[1, 2, 3].map(step => (
                <div 
                  key={step} 
                  className={`w-14 h-2 rounded-full transition-all duration-500 ${step <= currentStep ? 'bg-primary shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-white/10'}`}
                ></div>
              ))}
            </div>
            <span className="font-bold text-sm text-primary animate-pulse">Step {currentStep} of {totalSteps}</span>
          </div>

          <form className="space-y-12 relative z-10" onSubmit={handleSubmit}>
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-10"
                  >
                    <div>
                      <label className="font-heading text-2xl font-bold block mb-4 text-foreground flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-primary" /> What are you building?
                      </label>
                      <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-30 transition duration-500 blur"></div>
                        <textarea 
                          required
                          value={idea}
                          onChange={(e) => setIdea(e.target.value)}
                          className="relative w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-lg focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground resize-none shadow-inner" 
                          placeholder="e.g. A marketplace that connects space tourists with certified orbital dog walkers..." 
                          rows={3}
                        />
                      </motion.div>
                    </div>

                    <div className="pt-4">
                      <label className="font-heading text-xl font-bold block mb-6 text-foreground flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-400" /> How severe is the problem you're solving?
                      </label>
                      <div className="relative pt-8 pb-4">
                        <input 
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-background hover:[&::-webkit-slider-thumb]:scale-125 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                          max="10" min="1" step="0.1" type="range" 
                          value={severity}
                          onChange={(e) => setSeverity(parseFloat(e.target.value))}
                        />
                        <div className="flex justify-between mt-5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          <span className={severity < 4 ? "text-primary transition-colors" : ""}>Niche Inconvenience</span>
                          <span className={severity > 7 ? "text-red-400 transition-colors" : ""}>Critical Infrastructure</span>
                        </div>
                        <motion.div 
                          className="absolute top-0 -translate-x-1/2 bg-gradient-to-b from-primary to-emerald-600 text-primary-foreground font-black px-4 py-1.5 rounded-xl text-sm shadow-[0_0_15px_rgba(34,197,94,0.6)]" 
                          style={{ left: `calc(${(severity - 1) / 9 * 100}%)` }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {severity.toFixed(1)}
                        </motion.div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="font-semibold text-sm block mb-4 text-foreground uppercase tracking-wider text-muted-foreground">Existing Solutions in Market</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['Manual Legacy', 'Modern SaaS', 'Spreadsheets', 'In-house builds', 'Consultancy', 'No Solution'].map((chip, idx) => {
                          const isSelected = selectedChips.includes(chip);
                          return (
                            <motion.button 
                              key={chip}
                              type="button"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => toggleChip(chip)}
                              className={`px-5 py-4 rounded-xl border font-bold text-sm transition-all text-left flex items-center justify-between relative overflow-hidden ${
                                isSelected 
                                  ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                                  : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/30 hover:bg-white/10'
                              }`}
                            >
                              {isSelected && (
                                <motion.div layoutId="chip-glow" className="absolute inset-0 bg-primary/10 blur-md" />
                              )}
                              <span className="relative z-10">{chip}</span>
                              <CheckCircle className={`w-5 h-5 relative z-10 transition-all ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-10"
                  >
                    <div>
                      <label className="font-heading text-2xl font-bold block mb-6 text-foreground">Who are your customers?</label>
                      <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-30 transition duration-500 blur"></div>
                        <select 
                          value={customerType} 
                          onChange={(e) => setCustomerType(e.target.value)}
                          className="relative w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-lg focus:border-primary focus:ring-0 outline-none appearance-none transition-all cursor-pointer text-foreground shadow-inner"
                        >
                          <option value="" disabled>Select Customer Type</option>
                          <option value="b2b-enterprise">B2B Enterprise (Global 2000)</option>
                          <option value="b2b-smb">B2B SMBs / Startups</option>
                          <option value="b2c-mass">B2C Mass Market</option>
                          <option value="b2c-premium">B2C High Net Worth</option>
                          <option value="govt">Government & Public Sector</option>
                          <option value="devs">Developer-first Ecosystems</option>
                        </select>
                      </motion.div>
                    </div>
                    <div>
                      <label className="font-semibold text-sm block mb-4 text-foreground uppercase tracking-wider text-muted-foreground">Primary Target Market</label>
                      <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-30 transition duration-500 blur"></div>
                        <input 
                          required
                          value={targetMarket}
                          onChange={(e) => setTargetMarket(e.target.value)}
                          className="relative w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-lg focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground shadow-inner" 
                          placeholder="e.g. Fintech in Southeast Asia, ESG reporting in EU" 
                          type="text"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
              )}

                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-10"
                  >
                    <div>
                      <label className="font-heading text-2xl font-bold block mb-4 text-foreground flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-400" /> What is your Unfair Advantage?
                      </label>
                      <p className="font-bold text-xs text-muted-foreground mb-6 uppercase tracking-wider">Detail your MOAT: Proprietary tech, network effects, distribution, or regulation.</p>
                      <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-30 transition duration-500 blur"></div>
                        <textarea 
                          required
                          value={unfairAdvantage}
                          onChange={(e) => setUnfairAdvantage(e.target.value)}
                          className="relative w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-lg focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted-foreground/40 resize-none text-foreground shadow-inner" 
                          placeholder="Describe why incumbent players cannot easily replicate your approach..." 
                          rows={6}
                        ></textarea>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-10 border-t border-white/5 relative z-10">
              <motion.button 
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className={`px-8 py-4 rounded-2xl border border-white/10 bg-white/5 font-bold text-sm text-foreground hover:bg-white/10 transition-all flex items-center gap-2 ${currentStep === 1 ? 'invisible' : ''}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>
              <div className="flex-1"></div>
              
              {currentStep < totalSteps ? (
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button 
                  type="submit"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  disabled={isSubmitting || !idea || !targetMarket || !unfairAdvantage || !customerType}
                  className="relative group px-12 py-4 rounded-2xl bg-gradient-to-r from-primary via-emerald-500 to-blue-500 text-white font-heading text-lg font-black hover:brightness-110 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed min-w-[320px] justify-center overflow-hidden"
                >
                  {/* Animated Background for Submit Button */}
                  {!isSubmitting && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-primary to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-3 w-full justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin shrink-0 text-white" />
                        <span className="truncate">{loadingPhase}</span>
                      </>
                    ) : (
                      <>
                        Analyze Startup <Rocket className="w-6 h-6" />
                      </>
                    )}
                  </div>
                </motion.button>
              )}
            </div>
          </form>
        </GlassCard>
      </motion.div>

      {/* Contextual Insight Card */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1 text-foreground">Intelligence Hint</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Early-stage VCs prioritize MOAT over TAM. Be specific about your technical or data barriers to entry.</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1 text-foreground">Privacy Guaranteed</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Your data is processed in an isolated sandbox. No proprietary information is used to train public LLMs.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
