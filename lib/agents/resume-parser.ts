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

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key')) {
        console.log('Using mock resume parser');
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            techStack: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
            yearsOfExperience: 5,
            industry: 'Software Development',
            seniorityLevel: 'senior',
            projects: [
                {
                    name: 'E-commerce Platform',
                    technologies: ['React', 'Node.js', 'MongoDB'],
                    complexity: 'high',
                    description: 'Built a scalable e-commerce platform handling 10k daily users.'
                },
                {
                    name: 'Real-time Chat App',
                    technologies: ['Socket.io', 'Express', 'Redis'],
                    complexity: 'medium',
                    description: 'Implemented real-time messaging features.'
                }
            ],
            rawText: resumeText
        };
    }

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
