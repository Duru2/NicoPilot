import { StrategyReport } from '@/types';

type MockProfileTemplate = Omit<StrategyReport, 'diagnosis'> & {
    diagnosisTemplate: {
        summary: string;
        techStack: { depth: string; breadth: string };
        marketAlignment: { australia: number; korea: number };
        visaRisk: 'Low' | 'Medium' | 'High';
        validtiy?: string;
    };
};

export const MOCK_PROFILES: Record<string, MockProfileTemplate> = {
    'frontend': {
        diagnosisTemplate: {
            summary: "{{name}}님은 현대적인 웹 기술 스택(React/Vue 등)을 보유한 프론트엔드 개발자로서, 사용자 경험 중심의 서비스 기업에서 높은 수요가 예상됩니다.",
            techStack: { depth: "Modern Frontend Frameworks (React/Next.js)", breadth: "State Management, UI/UX" },
            marketAlignment: { australia: 88, korea: 82 },
            visaRisk: 'Medium'
        },
        marketComparison: {
            salary: {
                australia: { min: 90000, max: 130000, currency: 'AUD' },
                korea: { min: 45000000, max: 75000000, currency: 'KRW' }
            },
            trends: {
                australia: ['React Server Components', 'Accessibility', 'Design Systems'],
                korea: ['Next.js', 'Typescript', 'App Optimization']
            },
            competition: { australia: 'High', korea: 'High' },
            visaBarrier: 'Medium',
            workLifeBalance: { australia: 'High', korea: 'Medium' },
            conclusion: "프론트엔드 분야는 양국 모두 수요가 많으나, 호주는 디자인 시스템과 접근성을, 한국은 성능 최적화를 더 중시하는 경향이 있습니다."
        },
        riskMap: [
            { category: 'Language', risk: '협업 중심의 영어 소통 필요', severity: 'High', color: 'red' },
            { category: 'Visa', risk: '경력 2년 미만 시 스폰서십 제한', severity: 'Medium', color: 'yellow' },
            { category: 'Tech', risk: '구형 라이브러리(jQuery 등) 의존 시 마이너스', severity: 'Low', color: 'green' }
        ],
        skillGap: {
            australia: {
                market: 'Australia',
                missingSkills: ['WCAG Accessibility', 'Unit Testing (Jest/RTL)'],
                roadmap: ['접근성 가이드라인(WCAG) 학습', '테스트 주도 개발(TDD) 연습', '영문 기술 블로그 운영']
            },
            korea: {
                market: 'Korea',
                missingSkills: ['SSR Optimization', 'State Management Architecture'],
                roadmap: ['Next.js 심화 최적화 기법 습득', '대용량 트래픽 처리 경험 축적', '오픈소스 기여']
            }
        },
        resumeStrategy: {
            australia: {
                focus: ['Problem Solving', 'User Impact'],
                checklist: ['성과 수치화(성능 30% 개선 등)', '접근성/테스트 경험 강조', '비자 상태 명시']
            },
            korea: {
                focus: ['Implementation Details', 'Speed'],
                checklist: ['사용 기술 스택 상세 나열', '프로젝트 기여도 명시', '출시 서비스 링크 첨부']
            }
        },
        executionPlan: {
            month1: { focus: "기반 다지기", steps: [{ week: 1, task: "이력서 영문 변환", description: "ATS 최적화 포맷으로 변경" }, { week: 2, task: "링크드인 프로필 업데이트", description: "헤드라인 및 요약 섹션 강화" }] },
            month2: { focus: "시장 공략", steps: [{ week: 5, task: "30개 기업 타겟팅 지원", description: "매주 5개 기업 맞춤형 지원" }, { week: 6, task: "모의 인터뷰 진행", description: "화상 영문 인터뷰 연습" }] },
            month3: { focus: "최종 협상", steps: [{ week: 9, task: "기술 과제 수행", description: "테이크홈 과제 완벽 수행" }, { week: 11, task: "오퍼 레터 분석", description: "연봉 및 복지 조건 비교" }] }
        },
        companyFit: {
            australia: [{ name: "Canva", reason: "디자인 중심의 FE 개발 문화", matchScore: 95 }, { name: "Atlassian", reason: "대규모 디자인 시스템 경험 우대", matchScore: 90 }],
            korea: [{ name: "Toss", reason: "최고 수준의 UX 구현 능력 요구", matchScore: 92 }, { name: "Danggeun", reason: "지역 기반 서비스 최적화", matchScore: 88 }],
            conclusion: "사용자 인터페이스와 경험을 중시하는 Canva(호주)와 Toss(한국)가 최적의 매칭 기업입니다."
        },
        visaAnalysis: {
            currentStatus: { visaType: "N/A", riskLevel: "Medium" },
            pathways: [
                { subclass: "482", name: "TSS Visa", eligibility: "Medium", pros: ["빠른 수속"], cons: ["고용주 종속"], strategy: "스폰서십 가능 스타트업 공략" },
                { subclass: "189", name: "Skilled Independent", eligibility: "Low", pros: ["영주권"], cons: ["높은 점수 컷"], strategy: "영어 점수(PTE) 만점 확보 필수" }
            ],
            recommendation: "경력이 3년 미만이라면, 워킹홀리데이로 시작하여 482 스폰서십을 노리는 전략이 유효합니다."
        }
    },
    'backend': {
        diagnosisTemplate: {
            summary: "{{name}}님은 견고한 백엔드 시스템 설계 경험을 보유하고 있으며, 특히 클라우드 및 데이터 처리에 강점이 있어 양국 모두에서 핵심 인재로 분류됩니다.",
            techStack: { depth: "Server-side Logic & Database", breadth: "Cloud Infra & Architecture" },
            marketAlignment: { australia: 92, korea: 88 },
            visaRisk: 'Low'
        },
        marketComparison: {
            salary: {
                australia: { min: 100000, max: 150000, currency: 'AUD' },
                korea: { min: 50000000, max: 90000000, currency: 'KRW' }
            },
            trends: {
                australia: ['Microservices', 'AWS Lambda', 'Go/Rust'],
                korea: ['Spring Boot', 'MSA', 'Kafka']
            },
            competition: { australia: 'Medium', korea: 'High' },
            visaBarrier: 'Low',
            workLifeBalance: { australia: 'High', korea: 'Medium' },
            conclusion: "백엔드 엔지니어는 비자 취득에 가장 유리한 직군 중 하나이며, 호주에서는 연봉 상한선이 매우 높습니다."
        },
        riskMap: [
            { category: 'System Design', risk: '대규모 시스템 설계 경험 부재 시 한계', severity: 'Medium', color: 'yellow' },
            { category: 'Language', risk: '기술 용어 외 비즈니스 커뮤니케이션 능력', severity: 'Medium', color: 'yellow' },
            { category: 'Visa', risk: '관련 학위 비전공 시 경력 차감 가능성', severity: 'Low', color: 'green' }
        ],
        skillGap: {
            australia: {
                market: 'Australia',
                missingSkills: ['System Design (English)', 'Cloud Certifications (AWS/Azure)'],
                roadmap: ['시스템 디자인 인터뷰(Grokking) 준비', 'AWS Solutions Architect 취득']
            },
            korea: {
                market: 'Korea',
                missingSkills: ['High Traffic Handling', 'Event Driven Architecture'],
                roadmap: ['대용량 트래픽 처리 아키텍처 학습', 'Kafka/RabbitMQ 실무 적용']
            }
        },
        resumeStrategy: {
            australia: {
                focus: ['Scale & Reliability', 'Ownership'],
                checklist: ['처리한 트래픽 규모 명시 (TPS 등)', '시스템 안정성 기여도 작성', '소유권(Ownership) 강조']
            },
            korea: {
                focus: ['Architecture Decision', 'Framework Deep-dive'],
                checklist: ['사용 프레임워크 선정 이유', 'DB 설계 및 최적화 경험', '장애 대응 사례']
            }
        },
        executionPlan: {
            month1: { focus: "기초 자격 확보", steps: [{ week: 1, task: "알고리즘 문제 풀이 (LeetCode)", description: "Medium 난이도 50문제 돌파" }, { week: 3, task: "시스템 디자인 학습", description: "주요 아키텍처 패턴 정리" }] },
            month2: { focus: "실전 지원 준비", steps: [{ week: 5, task: "영문 이력서 피드백 반영", description: "원어민 첨삭 진행" }, { week: 7, task: "모의 코딩 테스트", description: "HackerRank 테스트 진행" }] },
            month3: { focus: "면접 및 오퍼", steps: [{ week: 10, task: "리더십 원칙 인터뷰 준비", description: "Amazon Leadership Principles 기반 답변" }, { week: 12, task: "비자 신청 서류 준비", description: "경력 증명서 번역 공증" }] }
        },
        companyFit: {
            australia: [{ name: "Xero", reason: "SaaS 기반 대규모 회계 시스템", matchScore: 93 }, { name: "Amazon (AU)", reason: "클라우드 및 백엔드 기술의 정점", matchScore: 89 }],
            korea: [{ name: "Line", reason: "대규모 글로벌 메신저 트래픽", matchScore: 91 }, { name: "Coupang", reason: "이커머스 MSA 아키텍처", matchScore: 90 }],
            conclusion: "안정적인 기술 환경을 원한다면 Xero, 도전적인 트래픽을 원한다면 Coupang이 적합합니다."
        },
        visaAnalysis: {
            currentStatus: { visaType: "N/A", riskLevel: "Low" },
            pathways: [
                { subclass: "189/190", name: "Skilled Visa", eligibility: "High", pros: ["독립 영주권"], cons: ["점수 경쟁"], strategy: "ACS 기술 심사 통과 후 190 주정부 후원 노리기" }
            ],
            recommendation: "백엔드 개발자는 부족 직군(MLTSSL)에 포함되므로 독립 기술 이민(189/190)을 우선적으로 고려하세요."
        }
    },
    'default': {
        diagnosisTemplate: {
            summary: "{{name}}님의 경력은 IT 산업 전반에 걸쳐 유효하며, 특정 분야로의 전문성을 강화한다면 더 높은 경쟁력을 확보할 수 있습니다.",
            techStack: { depth: "General IT Skills", breadth: "Versatile Experience" },
            marketAlignment: { australia: 70, korea: 70 },
            visaRisk: 'Medium'
        },
        marketComparison: {
            salary: {
                australia: { min: 80000, max: 120000, currency: 'AUD' },
                korea: { min: 40000000, max: 70000000, currency: 'KRW' }
            },
            trends: {
                australia: ['Digital Transformation', 'Agile'],
                korea: ['Digital New Deal', 'Smart Factory']
            },
            competition: { australia: 'Medium', korea: 'High' },
            visaBarrier: 'Medium',
            workLifeBalance: { australia: 'High', korea: 'Low' },
            conclusion: "일반적인 IT 경력으로는 호주의 워라밸과 한국의 익숙한 문화 사이에서 선택이 필요합니다."
        },
        riskMap: [
            { category: 'Specialization', risk: '명확한 전문 분야 부재', severity: 'High', color: 'red' },
            { category: 'Language', risk: '비즈니스 영어 필수', severity: 'High', color: 'red' },
            { category: 'Market', risk: '제너럴리스트 경쟁 심화', severity: 'Medium', color: 'yellow' }
        ],
        skillGap: {
            australia: { market: 'Australia', missingSkills: ['English Proficiency', 'Specialized Tech Stack'], roadmap: ['전문 기술 트랙 선택', '영어 점수 확보'] },
            korea: { market: 'Korea', missingSkills: ['Project Leading', 'Industry Expertise'], roadmap: ['산업군 전문성 강화', 'PM/PL 역량 확보'] }
        },
        resumeStrategy: {
            australia: { focus: ['Skill Definition', 'Achievement'], checklist: ['자신의 역할을 한 문장으로 정의', '정량적 성과 발굴'] },
            korea: { focus: ['Organization Fit', 'Stability'], checklist: ['조직 융화력 강조', '장기 근속 의지'] }
        },
        executionPlan: {
            month1: { focus: "진로 탐색", steps: [{ week: 1, task: "직무 적성 검사", description: "구체적인 전문 분야 설정" }] },
            month2: { focus: "역량 강화", steps: [{ week: 5, task: "사이드 프로젝트 시작", description: "포트폴리오 생성" }] },
            month3: { focus: "지원 및 검증", steps: [{ week: 9, task: "채용 공고 매칭", description: "적합한 포지션 탐색" }] }
        },
        companyFit: {
            australia: [{ name: "Telstra", reason: "대형 통신사, 다양한 IT 직군", matchScore: 80 }],
            korea: [{ name: "Samsung SDS", reason: "대규모 IT 서비스, 안정성", matchScore: 85 }],
            conclusion: "대기업 SI/SM 직군이나 대규모 인프라를 운영하는 기업이 적합할 수 있습니다."
        },
        visaAnalysis: {
            currentStatus: { visaType: "N/A", riskLevel: "Medium" },
            pathways: [{ subclass: "482", name: "TSS", eligibility: "Medium", pros: ["취업 우선"], cons: ["스폰서 찾기 난항"], strategy: "채용 연계형 비자 스폰서십 모색" }],
            recommendation: "명확한 기술 직군으로 포지셔닝(Positioning)하는 것이 비자 승인의 핵심입니다."
        }
    }
};
