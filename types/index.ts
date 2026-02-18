export interface ParsedResume {
    name?: string;
    jobTitle?: string;
    summary?: string;
    techStack: string[];
    yearsOfExperience: number;
    industry: string;
    seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead';
    projects: ProjectAnalysis[];
    rawText: string;
}

export interface ProjectAnalysis {
    name: string;
    technologies: string[];
    complexity: 'low' | 'medium' | 'high';
    description: string;
}

export interface MarketScore {
    australiaScore: number;
    koreaScore: number;
    factors: {
        marketDemand: number;
        englishRequirement: number;
        visaDifficulty: number;
        competitionLevel: number;
        salaryFit: number;
    };
}

export interface StrategyReport {
    marketFitAnalysis: string;
    riskFactors: string[];
    salaryPrediction: {
        australia: { min: number; max: number; currency: 'AUD' };
        korea: { min: number; max: number; currency: 'KRW' };
    };
    skillGapAnalysis: string[];
    actionPlan: ActionItem[];
}

export interface ActionItem {
    day: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

export interface Analysis {
    id: string;
    userId?: string;
    parsedResume: ParsedResume;
    marketScore: MarketScore;
    report?: StrategyReport;
    isPaid: boolean;
    createdAt: string;
}
