'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ParticleCosmos } from "@/components/ParticleCosmos";
import { Hexagon, Activity, Search, Users, CreditCard, CheckCircle, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-void min-h-screen text-bone font-acronym overflow-hidden selection:bg-plum-voltage/30 selection:text-bone">
      {/* Background Constellation */}
      <ParticleCosmos />

      {/* Content wrapper with z-index above the canvas */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-[1200px] mx-auto px-6">
        
        {/* Navigation */}
        <header className="flex justify-between items-center py-8 w-full">
          <div className="flex items-center gap-12">
            <Link className="flex items-center gap-3" href="/">
              <Hexagon className="w-5 h-5 text-plum-voltage" strokeWidth={1.5} />
              <span className="font-semibold text-[18px] text-bone tracking-wide">LaunchLens</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-8">
              <a className="text-smoke hover:text-bone text-[14px] font-normal tracking-[0.021em] transition-colors" href="#features">FEATURES</a>
              <a className="text-smoke hover:text-bone text-[14px] font-normal tracking-[0.021em] transition-colors" href="#how-it-works">HOW IT WORKS</a>
            </nav>
            <div className="flex items-center gap-6 pl-8">
              <button className="text-smoke hover:text-bone text-[14px] font-normal tracking-[0.021em] transition-colors">
                LOG IN
              </button>
              <button 
                onClick={() => router.push('/validation')}
                className="bg-plum-voltage text-bone px-4 py-[14px] rounded-[24px] text-[12px] font-semibold tracking-[0.05em] uppercase hover:brightness-110 transition-all leading-none"
              >
                Validate My Startup
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col pt-24 pb-20">
          {/* 50/50 Split */}
          <div className="flex flex-col md:flex-row w-full h-full">
            {/* Left: Tight text block */}
            <div className="w-full md:w-1/2 flex flex-col justify-center max-w-[480px]">
              <span className="text-bone text-[12px] font-semibold uppercase tracking-[0.05em] mb-4">
                INTELLIGENCE-DRIVEN VALIDATION
              </span>
              
              <h1 className="text-[78px] md:text-[113px] font-extralight leading-[0.81] tracking-[-0.04em] text-bone mb-8 break-words">
                Stop Building Startups Nobody Wants.
              </h1>
              
              <p className="text-[15px] md:text-[18px] font-normal leading-[1.5] tracking-[0.025em] text-ash mb-12 max-w-[60ch]">
                AI-powered startup due diligence that analyzes market demand, competition, customer profiles, pricing strategy, and investment potential before you spend months building.
              </p>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => router.push('/validation')}
                  className="bg-plum-voltage text-bone px-6 py-4 rounded-[24px] text-[12px] font-semibold tracking-[0.05em] uppercase hover:brightness-110 transition-all leading-none"
                >
                  Validate My Startup
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-smoke hover:text-bone text-[14px] font-normal tracking-[0.021em] transition-colors"
                >
                  See Example Report
                </button>
              </div>
            </div>
            
            {/* Right: Space for the cosmos to dominate */}
            <div className="w-full md:w-1/2 min-h-[500px] pointer-events-none">
              {/* The canvas sits behind this */}
            </div>
          </div>

          {/* Section Two: Features (Centered Composition) */}
          <section id="features" className="mt-48 flex flex-col items-center justify-center text-center">
            {/* Large geometric icon mid-canvas */}
            <div className="mb-16 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-lichen/30 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <div className="absolute inset-0 rounded-full border border-lichen/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] delay-1000"></div>
              <div className="border border-lichen/60 rounded-full p-12 bg-void/80 backdrop-blur-md shadow-[0_0_30px_rgba(45,212,191,0.15)] relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                >
                  <Hexagon className="w-24 h-24 text-lichen drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]" strokeWidth={1} />
                </motion.div>
              </div>
            </div>

            <h2 className="text-[48px] md:text-[78px] font-extralight leading-[0.9] tracking-[-0.04em] text-bone mb-8 max-w-[800px]">
              Deep Venture Intelligence
            </h2>
            
            <p className="text-[15px] md:text-[18px] font-normal leading-[1.5] tracking-[0.025em] text-ash mb-24 max-w-[60ch]">
              Our AI engine dissects your startup idea through six critical analytical lenses used by top tier VCs. A single paragraph anchored below the mark.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] w-full text-left">
              {[
                { icon: Activity, title: "Market Opportunity", desc: "Identify the actual TAM, SAM, and SOM for your specific niche with live web-scraped data points." },
                { icon: Search, title: "Competitor Intelligence", desc: "A deep dive into existing players, their pricing models, and the 'white space' they're missing." },
                { icon: Users, title: "ICP Generator", desc: "Automatically profile your Ideal Customer Personas, their pain points, and where to find them." },
                { icon: CreditCard, title: "Pricing Recommendations", desc: "Data-backed suggestions for subscription tiers, unit economics, and value-based pricing strategies." },
                { icon: CheckCircle, title: "Investor Mode", desc: "Generate a full investor-ready due diligence report that anticipates and answers hard questions." },
                { icon: Flame, title: "Roast My Startup", desc: "Brutal, honest feedback on why your startup might fail, helping you fix fatal flaws before launch." }
              ].map((feature, i) => (
                <div key={i} className="p-[24px] rounded-[24px] border border-bone/10 hover:border-plum-voltage/50 transition-colors bg-void/50 backdrop-blur-sm">
                  <feature.icon className="text-plum-voltage w-6 h-6 mb-6" strokeWidth={1.5} />
                  <h3 className="text-[24px] font-normal leading-[1.3] tracking-[0.021em] text-bone mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] font-normal leading-[1.5] tracking-[0.05px] text-ash">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section Three: How It Works */}
          <section id="how-it-works" className="mt-48 flex flex-col items-center justify-center text-center">
            <h2 className="text-[48px] md:text-[64px] font-extralight leading-[0.9] tracking-[-0.04em] text-bone mb-16">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-center max-w-[1000px] mx-auto">
              {[
                { step: "01", title: "Input Your Concept", desc: "Briefly describe your startup idea, target audience, and core features." },
                { step: "02", title: "AI Analysis", desc: "Our engine scrapes live market data, competitors, and trends." },
                { step: "03", title: "Get Your Report", desc: "Receive a comprehensive, venture-grade due diligence dossier." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center relative">
                  {i !== 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-bone/20 -z-10"></div>
                  )}
                  <div className="w-16 h-16 rounded-full border border-plum-voltage/50 bg-void flex items-center justify-center text-xl font-bold text-plum-voltage mb-6 shadow-[0_0_15px_rgba(157,78,221,0.2)]">
                    {item.step}
                  </div>
                  <h3 className="text-[20px] font-normal text-bone mb-3">{item.title}</h3>
                  <p className="text-[14px] text-ash max-w-[250px] leading-[1.6]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-48 mb-32 flex flex-col items-center justify-center text-center">
            <span className="text-plum-voltage text-[12px] font-semibold uppercase tracking-[0.05em] mb-4">
              READY TO LAUNCH
            </span>
            <h2 className="text-[48px] md:text-[78px] font-extralight leading-[0.9] tracking-[-0.04em] text-bone mb-8 max-w-[800px]">
              Start with clarity.
            </h2>
            <p className="text-[15px] md:text-[18px] font-normal leading-[1.5] tracking-[0.025em] text-ash mb-12 max-w-[60ch]">
              Join 4,000+ founders who saved an average of 3 months of wasted development time by validating their ideas first.
            </p>
            <button 
              onClick={() => router.push('/validation')}
              className="bg-plum-voltage text-bone px-8 py-5 rounded-[24px] text-[12px] font-semibold tracking-[0.05em] uppercase hover:brightness-110 transition-all leading-none"
            >
              Validate My Startup Now
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-12 border-t border-bone/10 flex flex-col md:flex-row justify-between items-center text-smoke text-[12px] tracking-[0.05em] uppercase font-semibold">
          <div className="mb-6 md:mb-0 flex items-center gap-3">
            <Hexagon className="w-4 h-4 text-bone" strokeWidth={1.5} />
            <span className="text-bone">LaunchLens</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-bone transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-bone transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-bone transition-colors">Security</a>
            <a href="#" className="hover:text-bone transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
