import { openai } from '@/lib/openai';
import { ParsedResume, MarketScore, StrategyReport } from '@/types';

export async function generateStrategyReport(
  resume: ParsedResume,
  marketScore: MarketScore
): Promise<StrategyReport> {
  const prompt = `당신은 기술 전문가가 호주와 한국 중 어디에서 일할지 결정하는 것을 돕는 시니어 커리어 전략가입니다.
**모든 분석 내용과 텍스트 필드는 반드시 한글로 작성해야 합니다.**

후보자 프로필:
- 기술 스택: ${resume.techStack.join(', ')}
- 경력: ${resume.yearsOfExperience}년
- 산업: ${resume.industry}
- 숙련도: ${resume.seniorityLevel}

시장 점수:
- 호주: ${marketScore.australiaScore}/100
- 한국: ${marketScore.koreaScore}/100

다음 내용을 포함하는 종합 전략 리포트를 생성하세요:

1. 시장 적합성 분석 (각 시장의 점수 이유를 설명하는 2-3개의 단락)
2. 위험 요소 (각 시장별로 3-5개의 구체적인 위험 요소 배열)
3. 연봉 예측 (경력과 시장에 기반한 현실적인 호주 달러(AUD) 및 한국 원(KRW) 범위)
4. 기술 격차 분석 (더 나은 시장 적합성을 위해 보완해야 할 3-5개의 기술 배열)
5. 90일 실행 계획 (1일차부터 90일차까지, 우선순위가 지정된 12-15개의 행동 항목 배열)

다음 구조의 JSON으로 반환하세요:
{
  "marketFitAnalysis": "상세 분석 텍스트",
  "riskFactors": ["위험 요소 1", "위험 요소 2", ...],
  "salaryPrediction": {
    "australia": { "min": 숫자, "max": 숫자, "currency": "AUD" },
    "korea": { "min": 숫자, "max": 숫자, "currency": "KRW" }
  },
  "skillGapAnalysis": ["기술 격차 1", "기술 격차 2", ...],
  "actionPlan": [
    {
      "day": 숫자 (1-90),
      "title": "행동 제목",
      "description": "상세 실행 내용",
      "priority": "high" | "medium" | "low"
    }
  ]
}

구체적이고 실행 가능하며 현실적이어야 합니다. 사용자가 취할 수 있는 실질적인 단계에 집중하세요. 모든 텍스트는 한국어로 제공되어야 합니다.`;

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
