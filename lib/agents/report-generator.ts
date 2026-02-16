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

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key')) {
    console.log('Using mock report generator');
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      marketFitAnalysis: "Based on your 5 years of experience with React and Node.js, you have a strong profile for both markets. \n\nIn Australia, there is high demand for Senior Full Stack developers, but visa sponsorship can be competitive. Your English proficiency will be a key differentiator.\n\nIn Korea, your tech stack is standard for modern startups and major tech companies (Naver, Kakao). The market is more accessible, but work-life balance may vary.",
      riskFactors: [
        "Australia: Visa sponsorship requirements rely heavily on verified work history",
        "Korea: Competitive market for mid-senior roles in top tier companies",
        "General: Keeping up with rapid changes in Next.js ecosystem"
      ],
      salaryPrediction: {
        australia: { min: 110000, max: 150000, currency: "AUD" },
        korea: { min: 60000000, max: 90000000, currency: "KRW" }
      },
      skillGapAnalysis: [
        "Cloud Architecture (AWS/GCP) certification would boost Australia prospects",
        "System Design interview preparation needed for senior roles",
        "Business English communication for Australian workplace culture"
      ],
      actionPlan: [
        {
          day: 7,
          title: "Optimize LinkedIn Profile",
          description: "Update headline and summary to target Australian recruiters. Set location to 'Open to work' in Sydney/Melbourne.",
          priority: "high"
        },
        {
          day: 14,
          title: "Technical Resume Audit",
          description: "Rewrite bullet points to focus on business impact and metrics (e.g., 'Reduced load time by 40%').",
          priority: "high"
        },
        {
          day: 30,
          title: "Apply to 5 Global Companies",
          description: "Target companies in Korea with global presence offering easier transfer opportunities.",
          priority: "medium"
        }
      ]
    };
  }

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
