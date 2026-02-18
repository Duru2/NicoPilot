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
    <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden font-sans">
      {/* Background Blobs (Soft & Cute) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative container mx-auto px-4 py-16 max-w-6xl">

        {/* Header / Nav */}
        <nav className="flex justify-center mb-16">
          <div className="bg-white/70 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white/50 hover:scale-105 transition-transform duration-300">
            <img src="/logo.svg" alt="NicoPilot" className="h-10" />
          </div>
        </nav>

        <div className="text-center mb-16 space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full shadow-sm mb-4">
            <span className="text-xl">🚀</span>
            <span className="text-sm font-bold text-blue-800 tracking-wide uppercase">10,000명 이상의 야심 찬 전문가들이 선택</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            당신의 가치가 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">제대로 평가받는 곳</span>은 어디일까요?
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            반복되는 탈락, 막연한 불안감... 당신의 잘못이 아닙니다. <br className="hidden md:block" />
            <span className="font-semibold text-slate-800">한국과 호주</span> 중 당신의 열정을 기다리는 진짜 시장을 찾아보세요. <br />
            당신의 다음 10년이 여기서 결정될 수 있습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left Column: Upload (Interactive & Cute) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/50 relative group hover:shadow-2xl transition-all duration-300">
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 z-20">
              오늘만 무료 분석 ✨
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 p-3 rounded-2xl text-xl shadow-sm">📂</span>
                인생의 전환점, 시뮬레이션
              </h2>

              <div
                {...getRootProps()}
                className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive
                  ? 'border-blue-500 bg-blue-50/50 scale-[1.02]'
                  : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors shadow-sm ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400'}`}>
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-700">
                      {isDragActive ? '당신의 꿈을 읽고 있어요... 🔥' : '이력서를 올리고 미래를 확인하세요'}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">당신의 가능성을 PDF 또는 TXT로 보여주세요</p>
                  </div>
                </div>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/0 backdrop-blur-sm text-slate-400 font-bold bg-[#F0F4F8]">또는 마음을 담아 직접 입력</span>
                </div>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="지금까지 걸어온 길을 여기에 적어주세요..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all text-sm font-medium"
              />

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-shake font-semibold">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !resumeText.trim()}
                className="w-full mt-6 bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-red-500/30 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group-hover:scale-[1.02] animate-pulse-slow"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>당신의 새로운 시작을 설계 중...</span>
                  </>
                ) : (
                  <>
                    <span>내 미래 설계도 확인하기</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4 font-medium flex items-center justify-center gap-1">
                🔒 <span>나의 커리어 데이터는 비공개로 안전하게 처리됩니다.</span>
              </p>
            </div>
          </div>

          {/* Right Column: Persuasive Features */}
          <div className="space-y-6 pt-4">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-default">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">💔</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">매번 실패하는 이유, 알아야 합니다</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    무의미한 지원서 100개보다, **나를 간절히 원하는 시장** 1곳을 찾는 것이 백번 낫습니다. 당신의 강점을 제대로 알아주는 곳으로 안내할게요.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-default">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">🛫</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">인생은 선택의 연속입니다</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    호주의 여유로운 삶과 한국의 빠른 성장, 당신의 성향과 스펙에 맞춰 어디서 더 빛날 수 있을지 냉철하게 분석해 드립니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-default">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">�</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">당신의 가치는 생각보다 높습니다</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    숨겨진 몸값을 찾아보세요. 글로벌 시장 데이터는 당신이 받아야 할 **정당한 대우**가 무엇인지 생생하게 보여줄 것입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* FOMO / Social Proof */}
            <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-3">
                    {[10, 12, 15, 20].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-600 overflow-hidden`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 50}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">★★★★★</span>
                </div>
                <p className="font-medium text-slate-300 text-sm italic">
                  "이 분석을 보지 못했다면 저는 지금도 한국에서 연봉 3천만 원에 허덕이고 있었을 거예요. 이제 저는 호주에서 제 가치를 증명하며 살고 있습니다."
                </p>
                <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-wider">
                  — 박지우 (호주 유니콘 기업 이직 성공)
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
