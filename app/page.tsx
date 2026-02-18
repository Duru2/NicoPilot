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

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to extract PDF text');
        }
        setResumeText(data.text);
      } else {
        const text = await file.text();
        setResumeText(text);
      }
    } catch (err: any) {
      setError(`Vercel Debug Error: ${err.message || 'Failed to read file.'}`);
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
      setError('Please upload a resume or paste your resume text');
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
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      router.push(`/results/${data.id}`);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
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
            <span className="text-sm font-bold text-blue-800 tracking-wide uppercase">Used by 10,000+ ambitious professionals</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Stop Guessing. <br />
            Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Getting Hired.</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The job market is uncertain. <span className="font-semibold text-slate-800">Don't trigger the ATS rejection algorithm.</span>
            <br className="hidden md:block" />
            Our AI analyzes 350M+ data points to double your interview chances.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left Column: Upload (Interactive & Cute) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/50 relative group hover:shadow-2xl transition-all duration-300">
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 z-20">
              FREE ANALYSIS ✨
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 p-3 rounded-2xl text-xl shadow-sm">📂</span>
                Upload Your Resume
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
                      {isDragActive ? 'Drop it like it\'s hot! 🔥' : 'Drag & Drop your resume'}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">PDF or TXT (Max 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/0 backdrop-blur-sm text-slate-400 font-bold bg-[#F0F4F8]">OR PASTE TEXT</span>
                </div>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
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
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze For Free</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4 font-medium flex items-center justify-center gap-1">
                🔒 <span>Bank-grade encryption. Your data is safe.</span>
              </p>
            </div>
          </div>

          {/* Right Column: Persuasive Features */}
          <div className="space-y-6 pt-4">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-default">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">📈</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Increase Success Rate</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    Break through the uncertainty. Users who optimize with NicoPilot land interviews <span className="text-green-600 font-bold bg-green-50 px-1 rounded">2x faster</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-default">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">🌏</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Global Market Fit</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    Applying to Australia or Korea? We decode the local hiring nuances so you don't look like an outsider.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-default">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">💰</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Salary & Prediction</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    Stop leaving money on the table. Know your worth with real-time salary data calibrated to your skills.
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
                  "I was getting 0 interviews for months. One scan with NicoPilot fixed my keywords and I got hired in 2 weeks."
                </p>
                <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-wider">
                  — Sarah K., Software Engineer
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
