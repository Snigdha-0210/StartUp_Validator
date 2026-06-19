'use client';

import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusChip } from "@/components/ui/StatusChip";
import Globe3DDemo from "@/components/3d-globe-demo";
import { Search, Filter, Download, ChevronRight, TrendingUp, Users, DollarSign, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import { Loader2 } from "lucide-react";

export default function CompetitorsPage() {
  const activeStartup = useAppStore(state => state.startups.find(s => s.id === state.selectedStartupId));
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const allCompetitors = activeStartup?.competitors || [];
  const filteredCompetitors = allCompetitors.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.differentiation.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "All") return matchesSearch;
    return matchesSearch && comp.threatLevel.toLowerCase() === activeFilter.toLowerCase();
  });

  // Debounced tracking for competitor search/filter
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (typeof pendo !== 'undefined') {
        pendo.track("competitor_search_executed", {
          search_query: searchQuery,
          active_filter: activeFilter,
          results_count: filteredCompetitors.length,
          total_competitors: allCompetitors.length,
          startup_id: activeStartup?.id,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  const exportToPDF = async () => {
    setIsExportingPDF(true);
    try {
      const exportArea = document.getElementById("competitors-export-area");
      if (!exportArea) return;

      const buttonsContainer = document.getElementById("export-actions-container");
      if (buttonsContainer) buttonsContainer.style.display = 'none';

      const imgData = await htmlToImage.toPng(exportArea, {
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
      const fileName = `${activeStartup?.name?.replace(/\s+/g, '_')}_Competitors_Analysis.pdf`;
      pdf.save(fileName);
      if (typeof pendo !== 'undefined') {
        pendo.track("competitor_analysis_exported", {
          startup_id: activeStartup?.id,
          startup_name: activeStartup?.name,
          competitor_count: allCompetitors.length,
          file_name: fileName,
          format: "PDF",
        });
      }
    } catch (error) {
      console.error("Failed to export PDF", error);
    }
    setIsExportingPDF(false);
  };

  return (
    <div id="competitors-export-area" className="p-8 space-y-6 flex-1 relative min-h-full bg-background">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <header className="flex justify-between items-end mb-10">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/60 mb-2 uppercase tracking-widest">
            <span>Intelligence</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Competitor Analysis</span>
          </nav>
          <h2 className="font-heading text-3xl font-semibold text-foreground">Market Landscape <span className="text-muted-foreground/30">/</span> Direct Peers</h2>
        </div>
        <div id="export-actions-container" className="flex gap-4">
          <div className="flex items-center bg-black/20 border border-white/10 rounded-xl px-4 py-2">
            <Search className="text-muted-foreground w-4 h-4 mr-2" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-48 text-foreground outline-none" 
              placeholder="Search competitors..." 
              type="text" 
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`glass-panel-subtle px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 text-foreground ${activeFilter !== "All" ? 'bg-primary/20 border-primary/50 text-primary' : 'hover:bg-white/10'}`}
            >
              <Filter className="w-4 h-4" /> {activeFilter !== "All" ? activeFilter : "Filters"}
            </button>
            {showFilterDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 w-40 bg-[#0a1118] border border-white/10 rounded-xl shadow-2xl z-50 p-2 flex flex-col gap-1 backdrop-blur-xl"
              >
                {['All', 'High', 'Medium', 'Low'].map(f => (
                  <button 
                    key={f}
                    onClick={() => { setActiveFilter(f); setShowFilterDropdown(false); }}
                    className={`text-left px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === f ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-foreground'}`}
                  >
                    {f === 'All' ? 'All Threats' : `${f} Threat`}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <button onClick={exportToPDF} disabled={isExportingPDF} className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-emerald-950 px-6 py-2 rounded-xl text-sm font-black hover:brightness-110 hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(34,197,94,0.2)]">
            {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
            {isExportingPDF ? "Exporting..." : "Export Analysis"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* COMPETITOR TABLE */}
        <section className="xl:col-span-8 space-y-6">
          <GlassCard className="rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-heading text-xl font-semibold text-foreground">Peer Comparison Matrix</h3>
              <span className="text-xs text-muted-foreground/50 font-semibold">Updated 4m ago</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-muted-foreground/60 border-b border-white/5 uppercase tracking-widest bg-black/10">
                    <th className="px-8 py-5 font-semibold">Competitor</th>
                    <th className="px-6 py-5 font-semibold">Strengths</th>
                    <th className="px-6 py-5 font-semibold">Weaknesses</th>
                    <th className="px-6 py-5 font-semibold">Threat Level</th>
                    <th className="px-8 py-5 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredCompetitors.map((comp, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring' }}
                      key={comp.name} 
                      className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-black/20 border border-white/10 flex items-center justify-center font-bold ${idx === 0 ? 'text-primary' : idx === 1 ? 'text-yellow-400' : 'text-blue-400'}`}>
                            {comp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{comp.name}</p>
                            <p className="text-xs text-muted-foreground/50">{comp.differentiation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-1">
                          {comp.strengths.slice(0, 2).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-1">
                          {comp.weaknesses.slice(0, 2).map((w, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[11px] font-bold border border-destructive/20">{w}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <StatusChip variant={comp.threatLevel.toLowerCase() === 'high' ? 'error' : comp.threatLevel.toLowerCase() === 'medium' ? 'warning' : 'success'} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${comp.threatLevel.toLowerCase() === 'high' ? 'bg-destructive animate-pulse' : comp.threatLevel.toLowerCase() === 'medium' ? 'bg-yellow-400' : 'bg-primary'}`}></span> {comp.threatLevel}
                        </StatusChip>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                          <TrendingUp className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  
                  {(!activeStartup?.competitors || activeStartup.competitors.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-muted-foreground">
                        Generate a startup validation first to see competitors.
                      </td>
                    </tr>
                  ) : filteredCompetitors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-muted-foreground">
                        No competitors found matching your search.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-6">
            <GlassCard className="rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-primary w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Talent Migration</h4>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-heading text-4xl font-black text-foreground">+14%</span>
                <span className="text-xs font-bold text-primary pb-1">MoM Increase</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground/60">Competitors are losing key engineers to decentralized startups.</p>
            </GlassCard>
            
            <GlassCard className="rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="text-secondary w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Funding Velocity</h4>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-heading text-4xl font-black text-foreground">2.4x</span>
                <span className="text-xs font-bold text-secondary pb-1">Market Avg</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground/60">Sector funding rounds are accelerating in frequency and size.</p>
            </GlassCard>
          </div>
        </section>

        {/* SIDE PANEL */}
        <aside className="xl:col-span-4 space-y-6">
          {/* Gauge Widget */}
          <GlassCard className="rounded-3xl p-8 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)] relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="font-heading text-xl font-semibold mb-8 text-foreground">Market Saturation</h3>
            <div className="relative flex justify-center py-4">
              <svg className="w-48 h-48 transform -rotate-90">
                <defs>
                  <linearGradient id="satGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                <motion.circle 
                  cx="96" cy="96" fill="transparent" r="80" stroke="url(#satGradient)" 
                  strokeDasharray="502.4" strokeDashoffset="150" strokeWidth="12"
                  initial={{ strokeDashoffset: 502.4 }}
                  animate={{ strokeDashoffset: 150 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                ></motion.circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                  className="font-heading text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600 drop-shadow-md"
                >
                  72%
                </motion.span>
                <span className="text-xs text-emerald-500/80 font-bold uppercase tracking-widest mt-1">Saturated</span>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-muted-foreground/70">New Entrants (30d)</span>
                <span className="text-foreground">14</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "66%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-primary rounded-full"
                ></motion.div>
              </div>
              <p className="text-xs text-muted-foreground/60 leading-relaxed font-medium">
                The current market phase indicates <span className="text-primary font-bold">High Consolidation</span>. Direct competitors have secured 60% of the addressable TAM.
              </p>
            </div>
          </GlassCard>

          {/* Risk Analysis */}
          <GlassCard className="rounded-3xl p-8 shadow-[inset_0_1px_1px_rgba(187,247,208,0.15)]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-heading text-xl font-semibold text-foreground">Vulnerability Index</h3>
              <Info className="text-muted-foreground w-5 h-5" />
            </div>
            <ul className="space-y-6">
              {activeStartup?.competitors?.slice(0, 2).map((comp, idx) => (
                <motion.li 
                  key={comp.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.2) }}
                  className="flex items-start gap-4 group cursor-default"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${idx === 0 ? 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-secondary shadow-[0_0_8px_rgba(153,212,174,0.6)]'}`}></div>
                  <div>
                    <p className="font-semibold text-sm mb-1 text-foreground group-hover:text-white transition-colors">{comp.strengths[0] || "Aggressive Positioning"}</p>
                    <p className="text-sm text-muted-foreground/70">{comp.name} leverages this to capture our shared target audience.</p>
                  </div>
                </motion.li>
              ))}
              
              {(!activeStartup?.competitors || activeStartup.competitors.length === 0) && (
                <li className="text-muted-foreground text-sm">No vulnerability data available.</li>
              )}
            </ul>
            <button className="mt-8 w-full py-4 border border-white/10 rounded-2xl font-bold text-sm text-foreground hover:bg-white/5 transition-all">
              View Full Risk Report
            </button>
          </GlassCard>

          {/* Visual Asset Placeholder */}
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-white/10 group bg-[#080d12]">
            <Globe3DDemo />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c] via-[#0b0f0c]/40 to-transparent opacity-80"></div>
            <div className="absolute bottom-4 left-6 z-10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Global Heatmap</p>
              <p className="font-heading text-xl font-bold text-white">Funding Flux</p>
            </div>
          </div>
        </aside>
      </div>
      <div className="h-12"></div>
    </div>
  );
}
