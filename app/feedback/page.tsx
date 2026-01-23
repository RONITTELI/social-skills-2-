"use client";

import { useState, useEffect } from "react";
import { generateAiFeedback } from "@/lib/actions";
import Link from "next/link";

export default function ComprehensiveFeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [missingData, setMissingData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const speech = JSON.parse(localStorage.getItem("latestSpeechData") || "null");
      const emotion = JSON.parse(localStorage.getItem("latestEmotionData") || "null");
      const posture = JSON.parse(localStorage.getItem("latestPostureData") || "null");

      const missing = [];
      if (!speech) missing.push("Speech Analysis");
      if (!emotion) missing.push("Emotion Analysis");
      if (!posture) missing.push("Posture Analysis");
      setMissingData(missing);

      if (missing.length === 3) {
        setLoading(false);
        return;
      }

      const combinedData = {
        speech: speech || { note: "No speech data available" },
        emotion: emotion || { note: "No emotion data available" },
        posture: posture || { note: "No posture data available" }
      };

      try {
        const feedback = await generateAiFeedback(combinedData, "comprehensive");
        if (feedback) {
          setAiFeedback(feedback);
        } else {
          setError("Failed to generate feedback. Please check your API key or try again.");
        }
      } catch (err) {
        console.error("Error fetching AI feedback:", err);
        setError("An error occurred while generating feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Comprehensive <span className="text-indigo-600">Feedback</span>
          </h1>
          <p className="text-lg text-gray-600">
            A holistic view of your communication skills combining speech, emotion, and posture.
          </p>
        </div>

        {missingData.length > 0 && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
            <strong>Note:</strong> For the best results, please complete the following modules: {missingData.join(", ")}.
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 font-medium">Consulting AI Coach...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Generate Feedback</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : aiFeedback ? (
          <div className="space-y-8 animate-fade-in">
            {/* Summary Section */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Executive Summary</h2>
                <div className="bg-indigo-100 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold text-indigo-700">Score: {aiFeedback.overallScore}/100</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{aiFeedback.summary}</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
                <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                  <span>🌟</span> Key Strengths
                </h3>
                <ul className="space-y-4">
                  {aiFeedback.strengths?.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 text-green-900">
                      <span className="font-bold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                <h3 className="text-xl font-bold text-orange-800 mb-6 flex items-center gap-2">
                  <span>🚀</span> Areas for Growth
                </h3>
                <ul className="space-y-4">
                  {aiFeedback.improvements?.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 text-orange-900">
                      <span className="font-bold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
                <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    &larr; Back to Dashboard
                </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No feedback available. Please complete at least one analysis module.
          </div>
        )}
      </div>
    </div>
  );
}
