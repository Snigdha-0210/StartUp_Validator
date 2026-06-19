export type StartupCategory = 'SaaS' | 'AI' | 'Marketplace' | 'Consumer' | 'Enterprise';

export interface RoastData {
  monetization: { title: string; description: string; score: number };
  marketSentiment: { saturation: string; moat: string; viralCoefficient: string };
  productStrategy: { title: string; description: string };
  landscapeAudit: { title: string; description: string; competitors: string[] };
  unitEconomics: { title: string; description: string };
}

export interface CompetitorData {
  name: string;
  threatLevel: string;
  strengths: string[];
  weaknesses: string[];
  differentiation: string;
}

export interface DeepICPData {
  demographics: { age: string; income: string; location: string; occupation: string };
  psychographics: { goals: string[]; fears: string[]; values: string[] };
}

export interface PricingFeature {
  feature: string;
  starter: boolean | string;
  growth: boolean | string;
  enterprise: boolean | string;
}

export interface DeepPricingData {
  starterPrice: number;
  growthPrice: number;
  enterprisePrice: number;
  features: PricingFeature[];
  insight: string;
}

export interface InvestorData {
  decision: 'YES' | 'NO';
  confidenceScore: number;
  thesis: string;
  thesisPoints: { title: string; description: string }[];
  tags: string[];
  marketPotential: { tam: string; sam: string; som: string };
  riskProfile: { executionRisk: number; marketSaturation: number; technicalMoat: number; criticalConcern: string };
  founderFit: { score: string; description: string; capability: string };
}

export interface StartupMockData {
  id: string;
  name: string;
  tagline: string;
  category: StartupCategory;
  description: string;
  founder: string;
  
  // Dashboard Metrics
  overallScore: number;
  marketScore: number;
  productScore: number;
  teamScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  
  // Basic ICP (Legacy)
  primaryICP: {
    title: string;
    description: string;
    painPoint: string;
    budget: string;
  };
  
  // Roadmap (Legacy)
  roadmapCurrent: string;
  roadmapNext: string;
  
  // Pricing (Legacy)
  pricingModel: string;
  monthlyPrice: number;

  // New Deep AI Fields
  roastData?: RoastData;
  competitors?: CompetitorData[];
  deepIcp?: DeepICPData;
  deepPricing?: DeepPricingData;
  investorData?: InvestorData;
}

export const mockStartups: StartupMockData[] = [
  {
    id: 'startup-1',
    name: 'FitSync AI',
    tagline: 'AI-Powered Personal Fitness Coach',
    category: 'AI',
    description: 'A mobile app that uses computer vision to correct exercise form in real-time and adapt workout plans.',
    founder: 'Alex Chen',
    overallScore: 82,
    marketScore: 78,
    productScore: 88,
    teamScore: 80,
    riskLevel: 'Medium',
    primaryICP: {
      title: 'Busy Professionals',
      description: 'Individuals working 50+ hours a week who want effective, safe home workouts.',
      painPoint: 'Lack of time for gym commute and fear of injury without a trainer.',
      budget: '$20-50/month',
    },
    roadmapCurrent: 'MVP with 10 core exercises and basic computer vision tracking.',
    roadmapNext: 'Integration with Apple Health and advanced workout generation.',
    pricingModel: 'Freemium with Pro subscription',
    monthlyPrice: 24,
  },
  {
    id: 'startup-2',
    name: 'NexusCRM',
    tagline: 'The First CRM for Decentralized Teams',
    category: 'SaaS',
    description: 'A collaborative customer relationship manager designed specifically for fully remote, async-first organizations.',
    founder: 'Sarah Jenkins',
    overallScore: 75,
    marketScore: 85,
    productScore: 70,
    teamScore: 70,
    riskLevel: 'Medium',
    primaryICP: {
      title: 'Remote-First SMBs',
      description: 'Companies with 20-200 employees spread across multiple time zones.',
      painPoint: 'Sales handoffs fail due to async communication gaps in traditional CRMs.',
      budget: '$50-100/user/month',
    },
    roadmapCurrent: 'Basic contact management and async handoff notes.',
    roadmapNext: 'AI-summarized account health reports for async catch-ups.',
    pricingModel: 'Per-user subscription',
    monthlyPrice: 49,
  },
  {
    id: 'startup-3',
    name: 'StudyFlow',
    tagline: 'Student Productivity & Flow State App',
    category: 'Consumer',
    description: 'Gamified pomodoro timer and task manager that syncs with university Canvas/Blackboard systems.',
    founder: 'Marcus Johnson',
    overallScore: 68,
    marketScore: 90,
    productScore: 65,
    teamScore: 50,
    riskLevel: 'High',
    primaryICP: {
      title: 'College Undergrads',
      description: 'Students juggling 4-5 classes, part-time work, and extracurriculars.',
      painPoint: 'Syllabus tracking is manual and deadline anxiety is high.',
      budget: '$5-10/month',
    },
    roadmapCurrent: 'Pomodoro timer with manual task entry.',
    roadmapNext: 'LMS integration (Canvas/Blackboard) for auto-importing assignments.',
    pricingModel: 'Freemium with premium themes and stats',
    monthlyPrice: 7,
  },
  {
    id: 'startup-4',
    name: 'HireMind',
    tagline: 'AI Recruiter & Interview Copilot',
    category: 'Enterprise',
    description: 'Automates initial tech screens using an interactive AI avatar and provides live nudges to human interviewers during final rounds.',
    founder: 'David Wu & Elena Rostova',
    overallScore: 89,
    marketScore: 82,
    productScore: 92,
    teamScore: 95,
    riskLevel: 'Low',
    primaryICP: {
      title: 'Mid-Market Tech Companies',
      description: 'Organizations hiring 50-200 software engineers annually.',
      painPoint: 'Engineering time wasted on early-stage technical screens.',
      budget: '$1k-5k/month',
    },
    roadmapCurrent: 'AI avatar tech screening for frontend roles.',
    roadmapNext: 'Live interviewer copilot (listening to zoom calls and suggesting questions).',
    pricingModel: 'Usage-based (per interview)',
    monthlyPrice: 2500,
  },
  {
    id: 'startup-5',
    name: 'TrendSpike',
    tagline: 'Creator Analytics & Sponsorship Valuation Platform',
    category: 'SaaS',
    description: 'Helps YouTubers and TikTokers accurately price their sponsorships based on real-time audience engagement metrics rather than just view counts.',
    founder: 'Chloe Martinez',
    overallScore: 79,
    marketScore: 75,
    productScore: 80,
    teamScore: 82,
    riskLevel: 'Medium',
    primaryICP: {
      title: 'Mid-Tier Creators',
      description: 'Creators with 100k-1M followers managing their own sponsorships.',
      painPoint: 'Underpricing brand deals due to lack of comparative data.',
      budget: '$50-150/month',
    },
    roadmapCurrent: 'YouTube API integration and engagement score calculator.',
    roadmapNext: 'Automated media kit generation and TikTok API integration.',
    pricingModel: 'Tiered subscription based on linked channels',
    monthlyPrice: 99,
  }
];
