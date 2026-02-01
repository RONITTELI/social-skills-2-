"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const FacialAnalysisDemo = dynamic(() => import("@/components/PostureEmotionDemo"), { ssr: false });

export default function EmotionAnalysisPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    // Check authorization on mount
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    setIsAuthorized(true);
  }, []);

  // Listen for feedback events from facial analysis component
  useEffect(() => {
    const handleFeedback = (event: any) => {
      setFeedback(event.detail);
    };
    window.addEventListener("emotionFeedback", handleFeedback);
    return () => window.removeEventListener("emotionFeedback", handleFeedback);
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Facial Emotion <span className="text-blue-600">Analysis</span>
          </h1>
          <p className="text-lg text-gray-600">
            Record yourself to analyze your facial expressions, eye contact, and emotional cues.
          </p>
        </div>

        {/* Live Facial Detection Demo */}
        <div className="mb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl p-8 shadow-lg border border-blue-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Facial Detection</h2>
            <p className="text-gray-600">See your facial expressions and emotions analyzed in real-time</p>
          </div>
          <FacialAnalysisDemo />
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Feedback</h2>
              <div className="space-y-4">
                {feedback.feedback && feedback.feedback.map((item: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-blue-50 rounded-xl">
                    <span className="text-2xl">💡</span>
                    <p className="text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm mb-2">Overall Emotion Score</p>
                <p className="text-5xl font-black text-blue-600">{feedback.overallScore}/100</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
