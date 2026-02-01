"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function PromptContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const title = params.get("title");
  const prompt = params.get("prompt");

  useEffect(() => {
    // Check authorization
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    setIsAuthorized(true);

    if (title && prompt) {
      localStorage.setItem("scenario", JSON.stringify({ title, prompt }));
    }
  }, [title, prompt, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => router.push('/scenarios')} className="text-slate-400 hover:text-slate-200 mb-4 flex items-center gap-2 transition font-medium">
            <span>←</span> Back to Scenarios
          </button>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-100">
            {title}
          </h1>
        </div>

        <div className="card p-10 shadow-2xl mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Your Prompt</h2>
              <p className="text-2xl text-slate-100 font-medium leading-relaxed">{prompt}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
          <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tips for Best Results
          </h3>
          <ul className="text-slate-300 space-y-2 ml-7">
            <li>• Speak clearly and at a moderate pace (120-150 WPM)</li>
            <li>• Maintain good posture and eye contact with the camera</li>
            <li>• Take a moment to compose your thoughts before speaking</li>
            <li>• Avoid filler words like "um" or "uh"</li>
            <li>• Keep a professional tone and natural expression</li>
          </ul>
        </div>

        <button
          onClick={() => router.push("/record")}
          className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all shadow-lg font-semibold text-lg relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Live Analysis
          </span>
        </button>
      </div>
    </div>
  );
}

export default function PromptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-300">Loading...</p></div>}>
      <PromptContent />
    </Suspense>
  );
}
