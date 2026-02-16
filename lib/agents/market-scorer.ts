import { openai } from '@/lib/openai';
import { ParsedResume, MarketScore } from '@/types';

export async function calculateMarketScore(resume: ParsedResume): Promise<MarketScore> {
    const prompt = `You are a career market analyst specializing in tech job markets in Australia and South Korea.

Analyze this candidate profile and calculate market fit scores (0-100) for both countries.

Candidate Profile:
- Tech Stack: ${resume.techStack.join(', ')}
- Years of Experience: ${resume.yearsOfExperience}
- Industry: ${resume.industry}
- Seniority: ${resume.seniorityLevel}
- Number of Projects: ${resume.projects.length}

Consider these factors for each market:
1. Market Demand: How in-demand is this tech stack?
2. English Requirement: Language barrier impact (Australia requires fluent English)
3. Visa Difficulty: How hard is it to get work visa? (Australia has skilled migration, Korea is harder for foreigners)
4. Competition Level: How competitive is the market for this profile?
5. Salary Fit: Does experience level match typical salary expectations?

Return JSON:
{
  "australiaScore": number (0-100),
  "koreaScore": number (0-100),
  "factors": {
    "marketDemand": number (0-100, average of both markets),
    "englishRequirement": number (0-100, higher = better English proficiency needed),
    "visaDifficulty": number (0-100, higher = harder to get visa),
    "competitionLevel": number (0-100, higher = more competitive),
    "salaryFit": number (0-100, higher = better salary match for experience)
  }
}

Be realistic and data-driven in your assessment.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are a career market analyst. Always respond with valid JSON only.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No response from AI');
    }

    return JSON.parse(content);
}
