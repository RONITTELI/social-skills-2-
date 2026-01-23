"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeSpeech } from "../../lib/speechAnalysis";
import { generateFeedback } from "../../lib/feedbackEngine";
import { saveAnalysisResult } from "@/lib/actions";

export default function AnalysisPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ feedback: string[], recommendations: string[] } | null>(null);
  const [analysis, setAnalysis] = useState<{ wpm: number, fillerWords: number, transcript: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAnalysis = async () => {
      const transcript = localStorage.getItem("transcript");
      const durationStr = localStorage.getItem("duration");
      const userId = localStorage.getItem("userId");

      if (!transcript || !durationStr) {
        setError("No analysis data found. Please record a scenario first.");
        setLoading(false);
        return;
      }

      const duration = parseInt(durationStr, 10);
      if (isNaN(duration) || duration === 0) {
          setError("Invalid duration for analysis.");
          setLoading(false);
          return;
      }

      const speechAnalysis = analyzeSpeech(transcript, duration);
      setAnalysis(speechAnalysis);

      let userData = {
          personality: "ambivert",
          confidence: 7,
      };

      if (userId) {
        try {
          const res = await fetch(`/api/profile/${userId}`);
          const data = await res.json();
          if (data.profile) {
            userData = {
              personality: data.profile.personality || "ambivert",
              confidence: data.profile.confidence || 7,
            }
          }
        } catch (e) {
          console.error("Could not fetch profile, using default data.", e);
        }
      }

      const feedbackData = {
        ...speechAnalysis,
        duration,
        ...userData,
        tone: "neutral", // Placeholder for tone (Module 2)
        confidenceScore: userData.confidence,
        dominantEmotion: "neutral", // Placeholder for emotion (Module 3)
        eyeContact: "good", // Placeholder for eye contact (Module 3)
      };

      localStorage.setItem("latestSpeechData", JSON.stringify(feedbackData));
      
      if (userId) {
        await saveAnalysisResult(userId, 'speech', feedbackData);
      }

      const generated = generateFeedback(feedbackData);
      setFeedback(generated);
      setLoading(false);
    }

    processAnalysis();
  }, []);

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Your Analysis</h1>
          <p className="text-gray-700 text-lg">Review your performance and get personalized feedback</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-gray-700 font-medium">Analyzing your speech...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-2xl">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {analysis && feedback && (
          <div className="space-y-8">
            {/* Metrics Section */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Performance Metrics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Words per Minute</span>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{analysis.wpm}</p>
                  <p className="text-xs text-gray-500 mt-1">Target: 120-150 WPM</p>
                </div>
                
                <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Filler Words</span>
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{analysis.fillerWords}</p>
                  <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Your Transcript
                </h3>
                <p className="text-gray-700 italic leading-relaxed">"{analysis.transcript}"</p>
              </div>
            </div>

            {/* Feedback & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-2xl border-2 border-white/50">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Feedback
                </h2>
                <ul className="space-y-4">
                  {feedback.feedback.map((item, i) => (
                    <li key={i} className="flex gap-3 bg-white/60 backdrop-blur p-4 rounded-xl">
                      <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 shadow-2xl border-2 border-white/50">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  Recommendations
                </h2>
                <ul className="space-y-4">
                  {feedback.recommendations.map((item, i) => (
                    <li key={i} className="flex gap-3 bg-white/60 backdrop-blur p-4 rounded-xl">
                      <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-8">
              <button
                onClick={() => router.push("/scenarios")}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all shadow-xl font-semibold text-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Try Another Scenario</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}