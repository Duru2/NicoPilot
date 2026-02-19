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

export interface PositionDiagnosis {
    experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
    techStack: {
        depth: string; // e.g., "Deep in React/Node"
        breadth: string; // e.g., "Broad AWS/DevOps exposure"
    };
    marketAlignment: {
        australia: number; // 0-100
        korea: number; // 0-100
    };
    visaRisk: 'Low' | 'Medium' | 'High';
    languageRisk: 'Low' | 'Medium' | 'High';
    portfolioSignal: 'Weak' | 'Moderate' | 'Strong';
    summary: string; // "You are currently positioned as..."
}

export interface MarketComparison {
    salary: {
        australia: { min: number; max: number; currency: 'AUD' };
        korea: { min: number; max: number; currency: 'KRW' };
    };
    trends: {
        australia: string[];
        korea: string[];
    };
    competition: {
        australia: 'Low' | 'Medium' | 'High';
        korea: 'Low' | 'Medium' | 'High';
    };
    visaBarrier: 'Low' | 'Medium' | 'High';
    workLifeBalance: {
        australia: 'High' | 'Medium' | 'Low';
        korea: 'High' | 'Medium' | 'Low';
    };
    conclusion: string; // "Based on your current profile..."
}

export interface RiskItem {
    category: string;
    risk: string;
    severity: 'Low' | 'Medium' | 'High'; // Represents Yellow/Red/Green logic
    color: 'green' | 'yellow' | 'red';
}

export interface SkillGap {
    market: 'Australia' | 'Korea';
    missingSkills: string[];
    roadmap: string[];
}

export interface ResumeStrategy {
    australia: {
        focus: string[];
        checklist: string[];
    };
    korea: {
        focus: string[];
        checklist: string[];
    };
}

export interface ExecutionStep {
    week?: number;
    task: string;
    description?: string;
}

export interface ExecutionPlan {
    month1: { focus: string; steps: ExecutionStep[] };
    month2: { focus: string; steps: ExecutionStep[] };
    month3: { focus: string; steps: ExecutionStep[] };
}

export interface CompanyRecommendation {
    name: string;
    reason: string;
    matchScore: number;
}

export interface CompanyFit {
    australia: CompanyRecommendation[];
    korea: CompanyRecommendation[];
    conclusion: string;
}

export interface VisaPathway {
    subclass: string;
    name: string;
    eligibility: 'High' | 'Medium' | 'Low';
    pros: string[];
    cons: string[];
    strategy: string;
}

export interface VisaAnalysis {
    currentStatus: {
        visaType: string;
        riskLevel: 'Low' | 'Medium' | 'High';
    };
    pathways: VisaPathway[];
    recommendation: string;
}

export interface StrategyReport {
    diagnosis: PositionDiagnosis;
    marketComparison: MarketComparison;
    riskMap: RiskItem[];
    skillGap: {
        australia: SkillGap;
        korea: SkillGap;
    };
    resumeStrategy: ResumeStrategy;
    executionPlan: ExecutionPlan;
    companyFit: CompanyFit;
    visaAnalysis: VisaAnalysis;
}

export interface Analysis {
    id: string;
    userId?: string;
    parsedResume: ParsedResume;
    report?: StrategyReport;
    isPaid: boolean;
    createdAt: string;
}
