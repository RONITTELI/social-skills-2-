"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeSpeech } from "../../lib/speechAnalysis";
import { generateFeedback } from "../../lib/feedbackEngine";

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

      const generated = generateFeedback(feedbackData);
      setFeedback(generated);
      setLoading(false);
    }

    processAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-4">Your Analysis</h1>

      {loading && <p>Analyzing your speech...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {analysis && feedback && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Metrics</h2>
            <div className="bg-white p-4 shadow rounded-lg">
              <p><b>Words per Minute:</b> {analysis.wpm}</p>
              <p><b>Filler Words:</b> {analysis.fillerWords}</p>
              <p className="mt-2"><b>Transcript:</b> "{analysis.transcript}"</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Feedback</h2>
            <div className="bg-white p-4 shadow rounded-lg">
              <ul className="list-disc pl-5">
                {feedback.feedback.map((item, i) => <li key={i} className="mb-2">{item}</li>)}
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold mb-3 mt-6">Recommendations</h2>
            <div className="bg-white p-4 shadow rounded-lg">
              <ul className="list-disc pl-5">
                {feedback.recommendations.map((item, i) => <li key={i} className="mb-2">{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push("/scenarios")}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Try Another Scenario
      </button>
    </div>
  );
}