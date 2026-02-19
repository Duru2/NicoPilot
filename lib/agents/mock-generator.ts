import { ParsedResume, StrategyReport } from '@/types';
import { MOCK_PROFILES } from '@/lib/mocks/profiles';

export function generateMockReport(resume: ParsedResume): StrategyReport {
    // 1. Determine Role based on keywords
    const role = detectRole(resume.techStack, resume.jobTitle);
    const template = MOCK_PROFILES[role] || MOCK_PROFILES['default'];

    // 2. Dynamic Injection
    const name = resume.name || '지원자';
    const years = resume.yearsOfExperience || 0;

    // Inject Name into Summary
    const summary = template.diagnosisTemplate.summary
        .replace('{{name}}', name);

    // 3. Calculate Scores dynamically
    // Simple logic: Base 50 + (Years * 5) + (Tech Stack Count * 2) capped at 95
    const baseScore = 50;
    const expScore = Math.min(years * 5, 30);
    const techScore = Math.min(resume.techStack.length * 2, 15);
    const totalScore = Math.min(baseScore + expScore + techScore, 98);

    // Adjust for specific markets (just a simple heuristic)
    const auScore = role === 'frontend' || role === 'backend' ? totalScore : totalScore - 5;
    const krScore = role === 'backend' ? totalScore + 2 : totalScore;

    return {
        diagnosis: {
            experienceLevel: years > 7 ? 'Senior' : years > 3 ? 'Mid' : 'Junior',
            techStack: template.diagnosisTemplate.techStack,
            marketAlignment: {
                australia: auScore,
                korea: krScore
            },
            visaRisk: template.diagnosisTemplate.visaRisk,
            languageRisk: 'Medium', // Default assumption
            portfolioSignal: years > 3 ? 'Strong' : 'Moderate',
            summary: summary
        },
        marketComparison: template.marketComparison,
        riskMap: template.riskMap,
        skillGap: template.skillGap,
        resumeStrategy: template.resumeStrategy,
        executionPlan: template.executionPlan,
        companyFit: template.companyFit,
        visaAnalysis: template.visaAnalysis
    };
}

function detectRole(techStack: string[], jobTitle: string = ''): string {
    const text = [...techStack, jobTitle].join(' ').toLowerCase();

    if (text.includes('react') || text.includes('vue') || text.includes('frontend') || text.includes('css') || text.includes('html')) {
        return 'frontend';
    }
    if (text.includes('java') || text.includes('spring') || text.includes('node') || text.includes('backend') || text.includes('aws') || text.includes('db') || text.includes('sql')) {
        return 'backend';
    }
    // Add more detections as needed for other profiles in MOCK_PROFILES
    return 'default';
}
