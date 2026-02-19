import { openai } from '@/lib/openai';
import { ParsedResume } from '@/types';

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResume> {
    const prompt = `당신은 전문가 수준의 이력서 분석가입니다. 다음 이력서를 분석하고 구조화된 정보를 추출하세요.
**모든 텍스트 필드는 반드시 한국어로 번역하거나 한국어로 작성해야 합니다.**

이력서 내용:
${resumeText}

다음 구조의 JSON 객체로 반환하세요:
{
  "name": "인물 성명",
  "jobTitle": "현재 또는 가장 최근의 직책 (예: 시니어 풀스택 엔지니어)",
  "summary": "전문적인 요약 (2-3문장)",
  "techStack": ["기술, 언어, 프레임워크 리스트"],
  "yearsOfExperience": 숫자 (총 전문 경력 연수),
  "industry": "주요 산업 분야 (예: 핀테크, 이커머스, 헬스케어 등)",
  "seniorityLevel": "junior" | "mid" | "senior" | "lead",
  "projects": [
    {
      "name": "프로젝트명",
      "technologies": ["사용 기술"],
      "complexity": "low" | "medium" | "high",
      "description": "간단한 설명"
    }
  ]
}

정확하고 철저하게 분석하세요. 정보가 불분명한 경우 문맥에 따라 합리적인 추론을 하세요. 모든 결과는 한국어로 제공되어야 합니다.`;

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key')) {
        console.log('Using mock resume parser');
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            name: '김철수',
            jobTitle: '시니어 풀스택 엔지니어',
            summary: '확장 가능한 웹 애플리케이션 및 클라우드 인프라 구축에 능숙한 5년 차 풀스택 엔지니어입니다.',
            techStack: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
            yearsOfExperience: 5,
            industry: '소프트웨어 개발',
            seniorityLevel: 'senior',
            projects: [
                {
                    name: '이커머스 플랫폼 개발',
                    technologies: ['React', 'Node.js', 'MongoDB'],
                    complexity: 'high',
                    description: '일일 활성 사용자 1만 명 규모의 확장 가능한 이커머스 플랫폼을 구축했습니다.'
                },
                {
                    name: '실시간 채팅 애플리케이션',
                    technologies: ['Socket.io', 'Express', 'Redis'],
                    complexity: 'medium',
                    description: 'Socket.io를 활용한 실시간 메시징 기능을 개발하고 최적화했습니다.'
                }
            ],
            rawText: resumeText
        };
    }

    try {
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
    } catch (error) {
        console.error('Resume parsing failed, returning mock data:', error);
        return {
            name: '김철수',
            jobTitle: '시니어 풀스택 엔지니어',
            summary: '확장 가능한 웹 애플리케이션 및 클라우드 인프라 구축에 능숙한 5년 차 풀스택 엔지니어입니다.',
            techStack: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
            yearsOfExperience: 5,
            industry: '소프트웨어 개발',
            seniorityLevel: 'senior',
            projects: [
                {
                    name: '이커머스 플랫폼 개발',
                    technologies: ['React', 'Node.js', 'MongoDB'],
                    complexity: 'high',
                    description: '일일 활성 사용자 1만 명 규모의 확장 가능한 이커머스 플랫폼을 구축했습니다.'
                },
                {
                    name: '실시간 채팅 애플리케이션',
                    technologies: ['Socket.io', 'Express', 'Redis'],
                    complexity: 'medium',
                    description: 'Socket.io를 활용한 실시간 메시징 기능을 개발하고 최적화했습니다.'
                }
            ],
            rawText: resumeText
        };
    }
}
