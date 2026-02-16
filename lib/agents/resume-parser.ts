import { openai } from '@/lib/openai';
import { ParsedResume, ProjectAnalysis } from '@/types';

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResume> {
    const prompt = `You are an expert resume analyzer. Analyze the following resume and extract structured information.

Resume:
${resumeText}

Extract and return a JSON object with the following structure:
{
  "techStack": ["list of technologies, languages, frameworks"],
  "yearsOfExperience": number (total years of professional experience),
  "industry": "primary industry (e.g., fintech, e-commerce, healthcare, etc.)",
  "seniorityLevel": "junior" | "mid" | "senior" | "lead",
  "projects": [
    {
      "name": "project name",
      "technologies": ["tech used"],
      "complexity": "low" | "medium" | "high",
      "description": "brief description"
    }
  ]
}

Be precise and thorough. If information is unclear, make reasonable inferences based on context.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are a professional resume analyzer. Always respond with valid JSON only.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No response from AI');
    }

    const parsed = JSON.parse(content);

    return {
        ...parsed,
        rawText: resumeText,
    };
}
