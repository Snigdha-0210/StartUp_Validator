'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Rocket, Plus, LayoutDashboard, BadgeCheck, BarChart3, Users, CreditCard, LineChart, Flame, FileText, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Validation', href: '/validation', icon: BadgeCheck },
  { name: 'Competitors', href: '/competitors', icon: BarChart3 },
  { name: 'ICP', href: '/icp', icon: Users },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
  { name: 'Investor Mode', href: '/investor', icon: LineChart },
  { name: 'Roast', href: '/roast', icon: Flame },
  { name: 'Reports', href: '/report', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed h-full left-0 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col py-8 px-4 gap-y-2 z-50">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-white/10 border-glow">
          <Rocket className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-black colorful-text leading-none">LaunchLens</h1>
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Venture Intelligence</p>
        </div>
      </div>

      <button className="mb-6 w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95">
        <Plus className="w-5 h-5" />
        New Analysis
      </button>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border-r-4 border-primary translate-x-1" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 glass-panel-subtle bg-primary/5">
        <p className="text-xs font-semibold text-primary mb-1">Intelligence Cap</p>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="bg-primary w-[75%] h-full"></div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">75/100 Reports remaining</p>
      </div>
    </aside>
  );
}
