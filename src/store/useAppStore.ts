import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockStartups, StartupMockData } from '@/data/mockStartups';

interface AppState {
  startups: StartupMockData[];
  selectedStartupId: string;
  isSidebarOpen: boolean;
  
  // Actions
  setSelectedStartupId: (id: string) => void;
  toggleSidebar: () => void;
  updateStartupScores: (id: string, scores: Partial<StartupMockData>) => void;
  addGeneratedStartup: (startup: StartupMockData) => void;
  
  // Computed
  activeStartup: StartupMockData | undefined;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      startups: mockStartups,
      selectedStartupId: mockStartups[0].id,
      isSidebarOpen: true,
      
      setSelectedStartupId: (id: string) => set({ selectedStartupId: id }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      updateStartupScores: (id: string, scores: Partial<StartupMockData>) => set((state) => ({
        startups: state.startups.map(s => s.id === id ? { ...s, ...scores } : s)
      })),

      addGeneratedStartup: (startup: StartupMockData) => set((state) => ({
        startups: [startup, ...state.startups],
        selectedStartupId: startup.id
      }))
    }),
    {
      name: 'launchlens-storage', // name of the item in the storage (must be unique)
    }
  )
);
