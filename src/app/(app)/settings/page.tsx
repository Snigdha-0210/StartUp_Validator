'use client';

import { useState } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Bell, Camera, Brain, Sparkles, Zap, Rocket, Coins, Moon, Sun, Monitor, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function SettingsPage() {
  const [activeModel, setActiveModel] = useState('gpt-4o');
  const [connectedApps, setConnectedApps] = useState({ slack: true, notion: false, discord: false });
  const [isSaving, setIsSaving] = useState(false);

  const toggleApp = (app: keyof typeof connectedApps) => {
    setConnectedApps(prev => ({ ...prev, [app]: !prev[app] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 overflow-y-auto relative text-[#e3e1ec]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#12131a]/70 backdrop-blur-xl border-b border-white/10 px-8 md:px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">Settings</h2>
          <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
          <p className="text-base text-muted-foreground hidden sm:block">Manage your account and platform preferences</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-white/5 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </button>
          <motion.img 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full border border-primary/30 object-cover cursor-pointer shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
            alt="Profile Avatar" 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
          />
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto p-8 md:p-12 space-y-12 pb-24"
      >
        
        {/* Profile Section */}
        <motion.section variants={itemVariants} className="space-y-6" id="profile">
          <div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-1">Profile</h3>
            <p className="text-muted-foreground text-base">Update your personal details and public information.</p>
          </div>
          
          <GlassCard className="rounded-2xl p-8 flex flex-col md:flex-row gap-12 border border-white/10 bg-[#12131a]/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-500">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer">
                <motion.img 
                  whileHover={{ scale: 1.02 }}
                  className="w-32 h-32 rounded-3xl object-cover border-2 border-primary/30 group-hover:border-primary transition-colors shadow-lg" 
                  alt="User Avatar" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                  <Camera className="text-white w-8 h-8 scale-75 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </div>
              <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">Change Avatar</button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', type: 'text', val: 'Elena Rodriguez' },
                { label: 'Email Address', type: 'email', val: 'elena.rod@vcapital.ai' },
                { label: 'Company', type: 'text', val: 'Venture Catalyst Partners' },
                { label: 'Position', type: 'text', val: 'Senior Analyst' },
              ].map((field) => (
                <div key={field.label} className="space-y-2 group">
                  <label className="text-sm font-medium text-muted-foreground block group-focus-within:text-primary transition-colors">{field.label}</label>
                  <input className="w-full bg-[#0d0e15]/50 border border-white/10 rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#0d0e15] transition-all" type={field.type} defaultValue={field.val} />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        {/* AI Configuration Bento Grid */}
        <motion.section variants={itemVariants} className="space-y-6" id="ai-config">
          <div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-1">AI Configuration</h3>
            <p className="text-muted-foreground text-base">Fine-tune the intelligence engines powering your reports.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model Selection */}
            <GlassCard className="rounded-2xl p-6 md:col-span-2 space-y-6 border border-white/10 bg-[#12131a]/70 hover:border-white/20 transition-all duration-500">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Brain className="text-primary w-5 h-5" /> AI Model Selection
                </h4>
                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Enterprise Access</span>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'gpt-4o', name: 'GPT-4o', desc: 'Omni intelligence, best for deep analysis.', icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]' },
                  { id: 'claude', name: 'Claude 3.5 Sonnet', desc: 'Nuanced reasoning, great for ICP roasting.', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.15)]' },
                  { id: 'gemini', name: 'Gemini 1.5 Pro', desc: 'Massive context, best for 100+ page data rooms.', icon: Rocket, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', glow: 'shadow-[0_0_20px_rgba(129,140,248,0.15)]' }
                ].map((model) => {
                  const isActive = activeModel === model.id;
                  const Icon = model.icon;
                  return (
                    <motion.div 
                      key={model.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setActiveModel(model.id)}
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? `bg-white/5 border ${model.border} ${model.glow}` : 'bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${model.bg} flex items-center justify-center`}>
                          <Icon className={`${model.color} w-5 h-5`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{model.name}</p>
                          <p className="text-xs text-muted-foreground">{model.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AnimatePresence>
                          {isActive && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className={`flex items-center gap-1.5 text-[10px] font-bold ${model.color} animate-pulse tracking-widest uppercase`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${model.bg.replace('/20', '')}`}></span> ACTIVE
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <div className={`w-10 h-5 rounded-full relative p-0.5 transition-colors duration-300 ${isActive ? model.bg.replace('/20', '') : 'bg-white/10'}`}>
                          <motion.div 
                            layout
                            className={`absolute top-0.5 bottom-0.5 w-4 h-4 rounded-full ${isActive ? 'bg-white right-0.5' : 'bg-muted-foreground left-0.5'}`}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>

            {/* Usage Credits */}
            <GlassCard className="rounded-2xl p-6 space-y-6 flex flex-col border border-white/10 bg-[#12131a]/70 hover:border-white/20 transition-all duration-500">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Coins className="text-primary w-5 h-5" /> Usage Credits
              </h4>
              <div className="flex-1 flex flex-col justify-center text-center space-y-6">
                <div className="relative inline-flex items-center justify-center mx-auto group">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" fill="transparent" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                    <motion.circle 
                      initial={{ strokeDashoffset: 351.8 }}
                      animate={{ strokeDashoffset: 88 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="group-hover:stroke-emerald-400 transition-colors duration-300" 
                      cx="64" cy="64" fill="transparent" r="56" stroke="#22C55E" strokeDasharray="351.8" strokeWidth="8"
                    ></motion.circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-foreground">75%</span>
                    <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-1">Remaining</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-heading text-2xl font-bold text-foreground">37,500 / 50,000</p>
                  <p className="text-xs text-muted-foreground font-medium">Tokens reset in 12 days</p>
                </div>
                <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl text-sm font-semibold transition-all duration-300 text-foreground active:scale-95">
                  Buy More Credits
                </button>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        {/* Integrations Grid */}
        <motion.section variants={itemVariants} className="space-y-6" id="integrations">
          <div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-1">Connected Intelligence</h3>
            <p className="text-muted-foreground text-base">Connect your workspace tools to automate data ingestion.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'slack', name: 'Slack Notifications', desc: 'Send risk alerts and report summaries to channels.', letter: 'S', color: 'from-pink-500 via-red-500 to-yellow-500', bgHover: 'hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]', connectedColor: 'text-red-500 bg-red-500/10' },
              { id: 'notion', name: 'Notion Knowledge', desc: 'Sync portfolio companies to your Notion databases.', letter: 'N', color: 'text-white', bgHover: 'hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]', connectedColor: 'text-zinc-200 bg-zinc-200/10' },
              { id: 'discord', name: 'Discord Feed', desc: 'Broadcast venture updates to your community server.', letter: 'D', color: 'text-[#5865F2]', bgHover: 'hover:border-[#5865F2]/50 hover:shadow-[0_0_20px_rgba(88,101,242,0.15)]', connectedColor: 'text-[#5865F2] bg-[#5865F2]/10' }
            ].map((app) => {
              const isConnected = connectedApps[app.id as keyof typeof connectedApps];
              return (
                <GlassCard 
                  key={app.id} 
                  onClick={() => toggleApp(app.id as keyof typeof connectedApps)}
                  className={`rounded-2xl p-6 transition-all duration-300 group cursor-pointer bg-[#12131a]/70 ${isConnected ? app.bgHover.split(' ')[0].replace('hover:', '') + ' ' + app.bgHover.split(' ')[1].replace('hover:', '') : 'border-white/10 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isConnected ? 'bg-white/10' : 'bg-white/5'}`}
                    >
                      <span className={`text-2xl font-bold ${app.color.includes('from-') ? 'bg-clip-text text-transparent bg-gradient-to-tr ' + app.color : app.color}`}>
                        {app.letter}
                      </span>
                    </motion.div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${isConnected ? app.connectedColor : 'bg-white/5 text-muted-foreground'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-foreground mb-1">{app.name}</h5>
                  <p className="text-sm text-muted-foreground font-medium">{app.desc}</p>
                </GlassCard>
              )
            })}
          </div>
        </motion.section>


        <motion.div variants={itemVariants} className="flex justify-end gap-4 pt-8">
          <button className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-sm font-semibold transition-all duration-300 text-foreground active:scale-95">Discard Changes</button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-[180px] h-[46px] rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-80 disabled:hover:scale-100"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Save All Changes'
            )}
          </button>
        </motion.div>
        
      </motion.div>
      
      {/* Footer Area inside scrollable main */}
      <footer className="w-full py-8 px-8 md:px-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center bg-[#0d0e15] mt-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-2">
            <Rocket className="text-primary w-5 h-5" />
            <span className="font-heading text-lg font-bold text-foreground">LaunchLens</span>
          </div>
          <nav className="flex gap-6">
            <a className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">Security</a>
            <a className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">Contact</a>
          </nav>
        </div>
        <p className="text-xs font-medium text-muted-foreground mt-8 md:mt-0">© 2024 LaunchLens AI Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
}
