'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/extract-pdf', {
          method: 'POST',
          body: formData,
        });

        const responseText = await response.text();
        console.log('Raw Server Response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`서버 응답 오류 (Not JSON): ${responseText.slice(0, 100)}...`);
        }

        if (!response.ok) {
          throw new Error(data.error || 'PDF 텍스트 추출에 실패했습니다');
        }
        setResumeText(data.text);
      } else {
        const text = await file.text();
        setResumeText(text);
      }
    } catch (err: any) {
      setError(`Vercel 디버그 에러: ${err.message || '파일을 읽는데 실패했습니다.'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('이력서를 업로드하거나 텍스트를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        throw new Error('분석에 실패했습니다');
      }

      const data = await response.json();
      router.push(`/results/${data.id}`);
    } catch (err) {
      setError('이력서 분석에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-green-100 selection:text-green-900">
      {/* 1. Global Navigation Bar (Academy Style) */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
              <span className="text-2xl font-black text-[#00C73C] tracking-tighter">NicoPilot</span>
              <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest hidden sm:block">Career Institute</span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-[15px] font-bold text-slate-700">
              <a href="#" className="hover:text-[#00C73C] transition-colors">강사진 소개</a>
              <a href="#" className="hover:text-[#00C73C] transition-colors">합격수기 <span className="text-red-500 text-xs">N</span></a>
              <a href="#" className="hover:text-[#00C73C] transition-colors">커리큘럼</a>
              <a href="#" className="hover:text-[#00C73C] transition-colors">해외취업 가이드</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-slate-500 text-sm font-medium hover:text-slate-800">로그인</button>
            <div className="w-px h-3 bg-slate-300"></div>
            <button className="text-slate-500 text-sm font-medium hover:text-slate-800">회원가입</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl py-12">

        {/* 2. Main Layout: 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* LEFT COLUMN: Persuasive Copy & Success Stories */}
          <div className="lg:col-span-7 space-y-10 pt-4">

            {/* Hero Copy */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F8EE] text-[#00A832] rounded-md text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00C73C] animate-pulse"></span>
                2026년 해외취업 대비반 모집 중
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.25] tracking-tight">
                연봉 3,000에서 <br />
                <span className="text-[#00C73C] underline decoration-4 decoration-green-200 underline-offset-4">연봉 1억 글로벌 인재</span>로.
              </h1>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                한국에서의 경쟁이 지치시나요? <br className="hidden md:block" />
                당신의 경력을 호주 시장 관점에서 재해석해드립니다. <br />
                <span className="bg-yellow-100 px-1 font-bold text-slate-900">데이터 기반 커리어 진단</span>으로 합격 확률을 높이세요.
              </p>
            </div>

            {/* Success Metrics / Badges */}
            <div className="flex flex-wrap gap-4 border-y border-slate-100 py-6">
              <div className="flex items-center gap-3 px-4">
                <div className="text-3xl font-black text-slate-900">3,482<span className="text-sm font-medium text-slate-500 ml-1">명</span></div>
                <div className="text-xs text-slate-500 font-bold uppercase leading-tight">누적<br />진단</div>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3 px-4">
                <div className="text-3xl font-black text-slate-900">92<span className="text-sm font-medium text-slate-500 ml-1">%</span></div>
                <div className="text-xs text-slate-500 font-bold uppercase leading-tight">만족도<br />평점</div>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3 px-4">
                <div className="text-3xl font-black text-[#00C73C]">A+</div>
                <div className="text-xs text-slate-500 font-bold uppercase leading-tight">데이터<br />정확도</div>
              </div>
            </div>

            {/* Best Review / Success Story */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">호주 이직 성공</span>
                  <span className="text-slate-500 text-xs font-bold">박O우 님 (7년차 백엔드)</span>
                </div>
                <div className="flex text-yellow-400 text-xs">★★★★★</div>
              </div>
              <p className="text-slate-700 text-sm font-medium leading-relaxed mb-3">
                "막연하게 호주 가고 싶다 생각만 했는데, 이 리포트를 보고 당장 무엇을 준비해야 할지 명확해졌습니다. 특히 비자 점수 분석과 회사 추천이 소름돋게 정확했어요. 3개월 만에 시드니 핀테크 기업 오퍼 받았습니다!"
              </p>
              <div className="text-xs text-slate-400 font-medium">2026.01.15 작성</div>
            </div>

            {/* Trust Logos */}
            <div className="pt-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <p className="text-xs font-bold text-slate-400 mb-3 ml-1">주요 분석 대상 기업 데이터베이스</p>
              <div className="flex items-center gap-6">
                <img src="https://logo.clearbit.com/google.com" className="h-6" alt="Google" />
                <img src="https://logo.clearbit.com/atlassian.com" className="h-5" alt="Atlassian" />
                <img src="https://logo.clearbit.com/canva.com" className="h-6" alt="Canva" />
                <img src="https://logo.clearbit.com/naver.com" className="h-5" alt="Naver" />
                <img src="https://logo.clearbit.com/kakao.com" className="h-5" alt="Kakao" />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Application Form (Consultation Box) */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.1)] border border-slate-200 p-6 sticky top-24">
              <div className="bg-[#00C73C] text-white text-center py-3 rounded-t-xl -mx-6 -mt-6 mb-6">
                <h3 className="font-bold text-lg">무료 커리어 진단 신청</h3>
                <p className="text-xs opacity-90 font-medium mt-0.5">매일 선착순 50명 한정 무료</p>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${isDragActive
                    ? 'border-[#00C73C] bg-green-50'
                    : 'border-slate-300 hover:border-[#00C73C] hover:bg-slate-50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="font-bold text-slate-700 text-sm mb-1">
                  {isDragActive ? '파일을 놓아주세요!' : '이력서 파일 업로드 (PDF/TXT)'}
                </p>
                <p className="text-xs text-slate-400">클릭하거나 파일을 드래그하세요</p>
              </div>

              <div className="text-center text-xs text-slate-400 font-bold mb-4 flex items-center gap-2 justify-center after:content-[''] after:h-px after:w-full after:bg-slate-200 before:content-[''] before:h-px before:w-full before:bg-slate-200">
                <span className="shrink-0 px-2">또는 직접 입력</span>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="경력/프로젝트 내용을 여기에 붙여넣으세요..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C73C] focus:border-transparent outline-none resize-none text-sm mb-4 placeholder:text-slate-400"
              />

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
                  <span className="text-base">⚠️</span> {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !resumeText.trim()}
                className="w-full bg-[#00C73C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00b035] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-green-200 active:transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>분석 중입니다...</span>
                  </div>
                ) : (
                  '진단 결과 확인하기'
                )}
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-3">
                김기철 대표 컨설턴트의 1:1 진단 알고리즘이 적용됩니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 mt-20 py-12">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 NicoPilot Career Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
