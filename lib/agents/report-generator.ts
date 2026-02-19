import { openai } from '@/lib/openai';
import { ParsedResume, StrategyReport } from '@/types';

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
    console.error('OpenAI generation failed, returning mock data:', error);
    return MOCK_REPORT;
  }
}

const MOCK_REPORT: StrategyReport = {
  diagnosis: {
    experienceLevel: 'Mid',
    techStack: {
      depth: 'Deep in React/Node.js',
      breadth: 'Broad AWS/DevOps exposure',
    },
    marketAlignment: {
      australia: 85,
      korea: 70,
    },
    visaRisk: 'Medium',
    languageRisk: 'Low',
    portfolioSignal: 'Strong',
    summary:
      '당신은 글로벌 시장에서 경쟁력 있는 기술 스택을 보유하고 있으며, 특히 호주 시장에서의 수요가 높습니다.',
  },
  marketComparison: {
    salary: {
      australia: { min: 95000, max: 140000, currency: 'AUD' },
      korea: { min: 55000000, max: 85000000, currency: 'KRW' },
    },
    trends: {
      australia: ['Cloud Native', 'Cybersecurity', 'React'],
      korea: ['AI Service', 'Spring Boot', 'Data Engineering'],
    },
    competition: {
      australia: 'Medium',
      korea: 'High',
    },
    visaBarrier: 'Medium',
    workLifeBalance: {
      australia: 'High',
      korea: 'Low',
    },
    conclusion:
      '호주는 워라밸과 연봉 측면에서 유리하며, 한국은 빠른 승진과 네트워크 형성에 유리합니다.',
  },
  riskMap: [
    { category: 'Visa', risk: '스폰서십 확보 필요', severity: 'Medium', color: 'yellow' },
    { category: 'Language', risk: '비즈니스 영어 능통 필수', severity: 'Low', color: 'green' },
    { category: 'Network', risk: '현지 네트워크 부재', severity: 'High', color: 'red' },
  ],
  skillGap: {
    australia: {
      market: 'Australia',
      missingSkills: ['AWS Certified Solutions Architect', 'CI/CD Advanced Pipelines'],
      roadmap: ['AWS 자격증 취득', '오픈소스 프로젝트 참여', '영어 인터뷰 준비'],
    },
    korea: {
      market: 'Korea',
      missingSkills: ['Spring Boot', 'Information Processing Engineer'],
      roadmap: ['정보처리기사 취득', 'Spring Boot 프로젝트 포트폴리오 추가', '코딩테스트 심화 학습'],
    },
  },
  resumeStrategy: {
    australia: {
      focus: ['Impact Driven', 'Visa Status Clear'],
      checklist: ['성과 수치화 (Quantify achievements)', '비자 상태 명시', '링크드인 추천서 확보'],
    },
    korea: {
      focus: ['Tech Stack Detail', 'Teamwork'],
      checklist: ['기술 스택 상세 나열', '프로젝트 기여도 명시', '경력 기술서 최적화'],
    },
  },
  executionPlan: {
    month1: {
      focus: '기반 다기기',
      steps: [
        { week: 1, task: '이력서 및 링크드인 최적화', description: 'ATS 통과를 위한 키워드 최적화' },
        { week: 2, task: '30개 타겟 기업 리스트업', description: '채용 공고 분석 및 지원 전략 수립' },
        { week: 3, task: '영어 인터뷰 스크립트 작성', description: 'STAR 기법을 활용한 답변 준비' },
        { week: 4, task: '깃허브 포트폴리오 정리', description: '대표 프로젝트 리드미(README) 개선' },
      ],
    },
    month2: {
      focus: '적극적 지원',
      steps: [
        { week: 5, task: '매일 3개 기업 지원', description: '맞춤형 커버레터 작성 및 지원' },
        { week: 6, task: '모의 인터뷰 진행', description: '현직자 또는 튜터와 모의 인터뷰' },
        { week: 7, task: '기술 과제 테스트', description: '알고리즘 및 시스템 디자인 학습' },
        { week: 8, task: '네트워킹 이벤트 참여', description: '온/오프라인 밋업 참여' },
      ],
    },
    month3: {
      focus: '최종 합격',
      steps: [
        { week: 9, task: '심층 인터뷰 진행', description: '컬처 핏 및 기술 심층 면접' },
        { week: 10, task: '레퍼런스 체크 준비', description: '추천인 명단 확보 및 연락' },
        { week: 11, task: '연봉 협상 전략 수립', description: '시장 데이터 기반 협상' },
        { week: 12, task: '비자 발급 및 출국 준비', description: '비자 서류 준비 및 항공권 예매' },
      ],
    },
  },
  companyFit: {
    australia: [
      { name: 'Atlassian', reason: '글로벌 협업 툴 리더, 유연한 근무 환경', matchScore: 92 },
      { name: 'Canva', reason: '디자인 플랫폼 유니콘, 빠른 성장 가능성', matchScore: 88 },
      { name: 'Xero', reason: '클라우드 회계 소프트웨어, 안정적인 워라밸', matchScore: 85 },
    ],
    korea: [
      { name: 'Naver', reason: '국내 최고 포털, 대규모 트래픽 경험', matchScore: 90 },
      { name: 'Toss', reason: '핀테크 혁신, 주도적인 업무 환경', matchScore: 87 },
      { name: 'Kakao', reason: '국민 메신저 기반 다양한 서비스', matchScore: 86 },
    ],
    conclusion: '호주 Atlassian과 한국 Naver가 가장 적합한 기업으로 분석됩니다.',
  },
  visaAnalysis: {
    currentStatus: {
      visaType: 'N/A',
      riskLevel: 'Medium',
    },
    pathways: [
      {
        subclass: '482',
        name: 'Temporary Skill Shortage Visa',
        eligibility: 'Medium',
        pros: ['빠른 진행', '경력 인정'],
        cons: ['고용주 스폰서십 필요', '이직 제한'],
        strategy: '스폰서십 가능한 기업 집중 공략',
      },
      {
        subclass: '189',
        name: 'Skilled Independent Visa',
        eligibility: 'Low',
        pros: ['영주권', '자유로운 취업'],
        cons: ['높은 경쟁률', '긴 대기 시간'],
        strategy: 'PTE 영어 점수 만점 확보로 점수 경쟁력 확보',
      },
      {
        subclass: '491',
        name: 'Skilled Work Regional (Provisional) Visa',
        eligibility: 'High',
        pros: ['추가 점수 획득', '지역 이동 가능'],
        cons: ['지방 거주 및 근무 필수', '영주권 전환 기간 소요'],
        strategy: '지방 IT 허브 지역(예: Gold Coast, Adelaide) 타겟팅',
      },
    ],
    recommendation: '482 비자를 통한 경력 쌓기 후 186 ENS 비자 전환을 추천합니다.',
  },
};
