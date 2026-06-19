'use client';

import Link from 'next/link';
import { Search, Bell, Check, Briefcase } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNavigation() {
  const { startups, selectedStartupId, setSelectedStartupId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredStartups = startups.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex justify-between items-center w-full">
      <div className="flex items-center gap-6">
        <div ref={searchRef} className="relative group z-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input 
            className="bg-black/20 border border-white/10 rounded-full pl-10 pr-6 py-2 w-80 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
            placeholder="Search startup dossiers..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-3 w-96 bg-card border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/5 bg-black/40">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Dossiers ({filteredStartups.length})</span>
                </div>
                <div className="max-h-80 overflow-y-auto p-2 scrollbar-hide">
                  {filteredStartups.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">No startups found matching "{searchQuery}"</div>
                  ) : (
                    filteredStartups.map(startup => (
                      <button
                        key={startup.id}
                        onClick={() => {
                          setSelectedStartupId(startup.id);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-3 rounded-xl flex items-center justify-between transition-all ${selectedStartupId === startup.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                        <div className="flex flex-col">
                          <span className={`font-semibold text-sm ${selectedStartupId === startup.id ? 'text-primary' : 'text-foreground'}`}>{startup.name}</span>
                          <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {startup.category}
                          </span>
                        </div>
                        {selectedStartupId === startup.id && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/#features">Features</Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/#how-it-works">How it Works</Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/pricing">Pricing</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-white/10 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground leading-none">Venture Analyst</p>
            <p className="text-[11px] text-muted-foreground mt-1">Tier 1 Capital</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-primary/30 bg-muted flex items-center justify-center overflow-hidden">
            <img 
              alt="Profile" 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
