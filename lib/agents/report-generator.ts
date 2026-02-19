import { openai } from '@/lib/openai';
import { ParsedResume, StrategyReport } from '@/types';
import { generateMockReport } from './mock-generator';

export async function generateComprehensiveReport(
  resume: ParsedResume
): Promise<StrategyReport> {
  const prompt = `
Role: You are a Senior Career Strategist & Migration Expert specializing in tech markets for Australia and Korea.
Task: Analyze the provided candidate profile and generate a data-driven, strategic career report.
Context: The candidate is considering opportunities in both Australia (Global Talent/Skilled Migration) and Korea (Return/Domestic Career).

Candidate Profile:
- Name: ${resume.name || 'Candidate'}
- Job Title: ${resume.jobTitle || 'Tech Professional'}
- Tech Stack: ${resume.techStack.join(', ')}
- Experience: ${resume.yearsOfExperience} years
- Industry: ${resume.industry}
- Seniority: ${resume.seniorityLevel}
- Summary: ${resume.summary || 'N/A'}
- Projects: ${resume.projects.map((p) => `${p.name} (${p.technologies.join(', ')})`).join('; ')}

Requirements:
1.  **Diagnosis**: Assess their current standing honestly.
2.  **Comparison**: Compare AU vs KR markets with specific data (salary ranges, culture).
3.  **Risk Map**: visualizable risks (Visa, Tech stack depth, Language).
4.  **Roadmap**: 90-day actionable plan.
5.  **Visa Strategy**: Detailed 485/189/190/482 analysis for AU.
6.  **Language**: **OUTPUT MUST BE IN KOREAN.**

Output Format: JSON strictly adhering to the following structure.
{
  "diagnosis": {
    "experienceLevel": "Junior" | "Mid" | "Senior" | "Lead",
    "techStack": { "depth": "string", "breadth": "string" },
    "marketAlignment": { "australia": number(0-100), "korea": number(0-100) },
    "visaRisk": "Low" | "Medium" | "High",
    "languageRisk": "Low" | "Medium" | "High",
    "portfolioSignal": "Weak" | "Moderate" | "Strong",
    "summary": "One sentence summary of their position"
  },
  "marketComparison": {
    "salary": {
      "australia": { "min": number, "max": number, "currency": "AUD" },
      "korea": { "min": number, "max": number, "currency": "KRW" }
    },
    "trends": { "australia": ["string"], "korea": ["string"] },
    "competition": { "australia": "Low" | "Medium" | "High", "korea": "Low" | "Medium" | "High" },
    "visaBarrier": "Low" | "Medium" | "High",
    "workLifeBalance": { "australia": "High" | "Medium" | "Low", "korea": "High" | "Medium" | "Low" },
    "conclusion": "Strategic conclusion comparing both markets for this user"
  },
  "riskMap": [
    { "category": "string", "risk": "string", "severity": "Low" | "Medium" | "High", "color": "green" | "yellow" | "red" }
  ],
  "skillGap": {
    "australia": { "market": "Australia", "missingSkills": ["string"], "roadmap": ["string"] },
    "korea": { "market": "Korea", "missingSkills": ["string"], "roadmap": ["string"] }
  },
  "resumeStrategy": {
    "australia": { "focus": ["string"], "checklist": ["string"] },
    "korea": { "focus": ["string"], "checklist": ["string"] }
  },
  "executionPlan": {
    "month1": { "focus": "string", "steps": [{ "week": number, "task": "string", "description": "string" }] },
    "month2": { "focus": "string", "steps": [{ "week": number, "task": "string", "description": "string" }] },
    "month3": { "focus": "string", "steps": [{ "week": number, "task": "string", "description": "string" }] }
  },
  "companyFit": {
    "australia": [{ "name": "string", "reason": "string", "matchScore": number }],
    "korea": [{ "name": "string", "reason": "string", "matchScore": number }],
    "conclusion": "Overall recommendation"
  },
  "visaAnalysis": {
    "currentStatus": { "visaType": "string", "riskLevel": "Low" | "Medium" | "High" },
    "pathways": [{ "subclass": "string", "name": "string", "eligibility": "High" | "Medium" | "Low", "pros": ["string"], "cons": ["string"], "strategy": "string" }],
    "recommendation": "Final visa strategy recommendation"
  }
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior career strategist. Always respond with valid JSON only. Output strictly in Korean language.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI generation failed, returning dynamic mock data:', error);
    return generateMockReport(resume);
  }
}
