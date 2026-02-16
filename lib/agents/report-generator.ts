import { openai } from '@/lib/openai';
import { ParsedResume, MarketScore, StrategyReport } from '@/types';

export async function generateStrategyReport(
    resume: ParsedResume,
    marketScore: MarketScore
): Promise<StrategyReport> {
    const prompt = `You are a senior career strategist helping a tech professional decide between working in Australia vs South Korea.

Candidate Profile:
- Tech Stack: ${resume.techStack.join(', ')}
- Years of Experience: ${resume.yearsOfExperience}
- Industry: ${resume.industry}
- Seniority: ${resume.seniorityLevel}

Market Scores:
- Australia: ${marketScore.australiaScore}/100
- Korea: ${marketScore.koreaScore}/100

Generate a comprehensive strategy report with:

1. Market Fit Analysis (2-3 paragraphs explaining why each market scored as it did)
2. Risk Factors (array of 3-5 specific risks for each market)
3. Salary Prediction (realistic ranges in AUD and KRW based on experience and market)
4. Skill Gap Analysis (array of 3-5 skills to develop for better market fit)
5. 90-Day Action Plan (array of 12-15 actionable items, days 1-90, prioritized)

Return JSON:
{
  "marketFitAnalysis": "detailed analysis text",
  "riskFactors": ["risk 1", "risk 2", ...],
  "salaryPrediction": {
    "australia": { "min": number, "max": number, "currency": "AUD" },
    "korea": { "min": number, "max": number, "currency": "KRW" }
  },
  "skillGapAnalysis": ["skill gap 1", "skill gap 2", ...],
  "actionPlan": [
    {
      "day": number (1-90),
      "title": "action title",
      "description": "what to do",
      "priority": "high" | "medium" | "low"
    }
  ]
}

Be specific, actionable, and realistic. Focus on practical steps they can take.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are a senior career strategist. Always respond with valid JSON only.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No response from AI');
    }

    return JSON.parse(content);
}
