"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const FacialAnalysisDemo = dynamic(() => import("@/components/PostureEmotionDemo"), { ssr: false });

export default function EmotionAnalysisPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

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

  const saveToDatabase = async () => {
    if (!feedback) {
      setSaveMessage("No data to save");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    const userId = localStorage.getItem("userId");

    try {
      await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: "emotion",
          data: feedback,
        }),
      });

      setSaveMessage("✅ Successfully saved to dashboard!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving analysis:", error);
      setSaveMessage("❌ Error saving data");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Facial Emotion Analysis
            </span>
          </h1>
          <p className="text-xl bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent max-w-2xl mx-auto">
            Analyze your facial expressions, eye contact, and emotional cues with AI
          </p>
        </div>

        {/* Control Buttons */}
        <div className="mb-8 flex gap-4 justify-center">
          <button
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
              isAnalyzing
                ? "bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-red-500/50 text-white"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-500/50 text-white"
            }`}
          >
            {isAnalyzing ? "⏹ Stop Analysis" : "▶ Start Analysis"}
          </button>
          {feedback && !isAnalyzing && (
            <button
              onClick={saveToDatabase}
              disabled={isSaving}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50"
            >
              {isSaving ? "💾 Saving..." : "💾 Save to Dashboard"}
            </button>
          )}
        </div>

        {saveMessage && (
          <div className={`text-center mb-6 font-bold text-lg ${saveMessage.includes("✅") ? "text-green-400" : "text-red-400"}`}>
            {saveMessage}
          </div>
        )}

        {/* Live Facial Detection Demo */}
        {isAnalyzing && (
          <div className="mb-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-400/30 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                Live Facial Detection
              </h2>
              <p className="text-purple-200">Real-time emotion and expression analysis</p>
            </div>
            <FacialAnalysisDemo />
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-purple-500/30 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                AI Feedback
              </h2>
              <div className="space-y-4">
                {feedback.feedback && feedback.feedback.map((item: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-purple-500/20 backdrop-blur border border-purple-400/30 rounded-xl">
                    <span className="text-2xl">💡</span>
                    <p className="text-purple-100 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur border border-blue-400/30 rounded-xl">
                  <p className="text-cyan-300 text-sm mb-2">Overall Score</p>
                  <p className="text-5xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    {feedback.overallScore}/100
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-400/30 rounded-xl">
                  <p className="text-purple-300 text-sm mb-2">Dominant Emotion</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent capitalize">
                    {feedback.dominantEmotion || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur border border-green-400/30 rounded-xl">
                <p className="text-green-300 text-sm mb-2">Eye Contact</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent capitalize">
                  {feedback.eyeContact || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
