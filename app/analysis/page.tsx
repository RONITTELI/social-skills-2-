"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeSpeech } from "../../lib/speechAnalysis";
import { generateFeedback } from "../../lib/feedbackEngine";
import { analyzePostureCues } from "../../lib/postureAnalysis";
import { analyzeFacialCues } from "../../lib/facialAnalysis";
import { saveAnalysisResult } from "@/lib/actions";

export default function AnalysisPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [feedback, setFeedback] = useState<{ feedback: string[], recommendations: string[] } | null>(null);
  const [analysis, setAnalysis] = useState<{ wpm: number, fillerWords: number, transcript: string } | null>(null);
  const [emotionAnalysis, setEmotionAnalysis] = useState<{ dominantEmotion: string, eyeContact: string } | null>(null);
  const [postureAnalysis, setPostureAnalysis] = useState<{ postureScore: number, postureIssues: string[] } | null>(null);
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAnalysis = async () => {
      const transcript = localStorage.getItem("transcript");
      const durationStr = localStorage.getItem("duration");
      const userId = localStorage.getItem("userId");
      const analyses = localStorage.getItem("selectedAnalyses");
      const videoURL = localStorage.getItem("videoURL");

      if (analyses) {
        setSelectedAnalyses(JSON.parse(analyses));
      }

      // Don't fail if no data - allow other analyses to work
      const duration = durationStr ? parseInt(durationStr, 10) : 0;
      
      // Only analyze speech if selected AND if there's a transcript
      let speechAnalysis = null;
      let speechError = null;
      
      if (!analyses || JSON.parse(analyses).includes('speech')) {
        if (!transcript || transcript.trim() === "") {
          speechError = "No speech detected. Please speak during recording.";
        } else if (isNaN(duration) || duration === 0) {
          speechError = "Invalid recording duration.";
        } else {
          speechAnalysis = analyzeSpeech(transcript, duration);
        }
      }

      // Analyze emotion if selected
      let emotionData = null;
      if (analyses && JSON.parse(analyses).includes('emotion') && videoURL) {
        try {
          if (videoRef.current) {
            videoRef.current.src = videoURL;
            emotionData = await analyzeFacialCues(videoRef.current);
          }
        } catch (e) {
          console.error("Emotion analysis failed:", e);
        }
      }

      // Analyze posture if selected
      let postureData = null;
      if (analyses && JSON.parse(analyses).includes('posture') && videoURL) {
        try {
          if (videoRef.current) {
            videoRef.current.src = videoURL;
            postureData = await analyzePostureCues(videoRef.current);
          }
        } catch (e) {
          console.error("Posture analysis failed:", e);
        }
      }

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
        ...(speechAnalysis || {}),
        duration,
        ...userData,
        tone: "neutral",
        confidenceScore: userData.confidence,
        dominantEmotion: emotionData?.dominantEmotion || "neutral",
        eyeContact: emotionData?.eyeContact || "good",
        postureScore: postureData?.postureScore || 0,
      };

      localStorage.setItem("latestSpeechData", JSON.stringify(feedbackData));
      

      // Save all analysis types if present and userId exists
      if (userId) {
        if (speechAnalysis) {
          await saveAnalysisResult(userId, 'speech', feedbackData);
        }
        if (emotionData) {
          await saveAnalysisResult(userId, 'emotion', emotionData);
        }
        if (postureData) {
          await saveAnalysisResult(userId, 'posture', postureData);
        }
      }

      // Generate rule-based feedback
      let generated = null;
      if (speechAnalysis) {
        generated = generateFeedback(feedbackData);
      }
      
      setAnalysis(speechAnalysis);
      setFeedback(generated);
      setEmotionAnalysis(emotionData);
      setPostureAnalysis(postureData);
      if (speechError) {
        // Don't set as error, just as a notice
      }
      setLoading(false);
    }

    processAnalysis();
  }, []);

  const isSpeechSelected = selectedAnalyses.includes('speech');
  const isEmotionSelected = selectedAnalyses.includes('emotion');
  const isPostureSelected = selectedAnalyses.includes('posture');

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hidden video element for analysis */}
        <video ref={videoRef} style={{ display: 'none' }} />
        
        <div className="mb-12">
          <button onClick={() => router.push('/scenarios')} className="text-slate-400 hover:text-slate-200 mb-4 flex items-center gap-2 transition font-medium">
            <span>←</span> Back to Scenarios
          </button>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-100">Analysis Results</h1>
          <p className="text-slate-300 text-lg">Review your performance and get personalized feedback</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-slate-300 font-medium">Analyzing your recording...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 p-6 rounded-lg">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {/* Selected Analyses Badge */}
            {selectedAnalyses.length > 0 && (
              <div className="card p-4 flex gap-2 flex-wrap">
                <span className="text-sm text-slate-400">Analyses performed:</span>
                {isSpeechSelected && <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">🎤 Speech</span>}
                {isEmotionSelected && <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">😊 Emotion</span>}
                {isPostureSelected && <span className="inline-block px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-sm">🧍 Posture</span>}
              </div>
            )}

            {/* Speech Analysis Section */}
            {isSpeechSelected && (
              <>
                {!analysis ? (
                  <div className="card p-8 border-l-4 border-blue-500 bg-blue-900/20">
                    <h2 className="text-2xl font-bold mb-4 text-slate-100 flex items-center gap-3">
                      <span className="text-2xl">🎤</span>
                      Speech Analysis
                    </h2>
                    <p className="text-slate-300">No speech detected. Please speak during recording for speech analysis.</p>
                  </div>
                ) : analysis && feedback ? (
                  <>
                    {/* Metrics Section */}
                    <div className="card p-8">
                      <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        Speech Performance Metrics
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-400">Words per Minute</span>
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <p className="text-4xl font-bold text-blue-400">{analysis.wpm}</p>
                          <p className="text-xs text-slate-400 mt-1">Target: 120-150 WPM</p>
                        </div>
                        
                        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-400">Filler Words</span>
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                          </div>
                          <p className="text-4xl font-bold text-purple-400">{analysis.fillerWords}</p>
                          <p className="text-xs text-slate-400 mt-1">Lower is better</p>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Your Transcript
                        </h3>
                        <p className="text-slate-300 italic leading-relaxed">"{analysis.transcript}"</p>
                      </div>
                    </div>

                    {/* Feedback & Recommendations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="card p-8">
                        <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          Feedback
                        </h2>
                        <ul className="space-y-3">
                          {feedback.feedback.map((item, i) => (
                            <li key={i} className="flex gap-3 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                              <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                              <span className="text-slate-300 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="card p-8">
                        <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          Recommendations
                        </h2>
                        <ul className="space-y-3">
                          {feedback.recommendations.map((item, i) => (
                            <li key={i} className="flex gap-3 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
                              <span className="text-slate-300 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            )}

            {/* Emotion Analysis Placeholder */}
            {isEmotionSelected && (
              <div className="card p-8 border-l-4 border-purple-500">
                <h2 className="text-2xl font-bold mb-4 text-slate-100 flex items-center gap-3">
                  <span className="text-2xl">😊</span>
                  Emotion Detection
                </h2>
                {emotionAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <p className="text-sm text-slate-400 font-medium mb-2">Dominant Emotion</p>
                        <p className="text-2xl font-bold text-purple-400 capitalize">{emotionAnalysis.dominantEmotion}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <p className="text-sm text-slate-400 font-medium mb-2">Eye Contact</p>
                        <p className="text-2xl font-bold text-purple-400 capitalize">{emotionAnalysis.eyeContact}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">Facial expressions and emotional indicators detected from your recording.</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Emotion analysis feature coming soon. This will detect facial expressions and emotional states from your recording.</p>
                )}
              </div>
            )}

            {/* Posture Analysis Placeholder */}
            {isPostureSelected && (
              <div className="card p-8 border-l-4 border-cyan-500">
                <h2 className="text-2xl font-bold mb-4 text-slate-100 flex items-center gap-3">
                  <span className="text-2xl">🧍</span>
                  Posture Analysis
                </h2>
                {postureAnalysis ? (
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <p className="text-sm text-slate-400 font-medium mb-2">Posture Score</p>
                      <p className="text-4xl font-bold text-cyan-400">{postureAnalysis.postureScore}%</p>
                      <p className="text-xs text-slate-400 mt-1">Based on frame analysis</p>
                    </div>
                    {postureAnalysis.postureIssues && postureAnalysis.postureIssues.length > 0 && (
                      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                        <p className="text-sm font-semibold text-slate-300 mb-2">Issues Detected:</p>
                        <ul className="space-y-2">
                          {postureAnalysis.postureIssues.map((issue, i) => (
                            <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                              <span className="text-cyan-400">•</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {postureAnalysis.postureIssues && postureAnalysis.postureIssues.length === 0 && (
                      <p className="text-slate-300 text-sm text-center py-2">✓ Great posture! No major issues detected.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Posture analysis feature coming soon. This will analyze body positioning, gestures, and confidence indicators from your recording.</p>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center pt-8">
              <button
                onClick={() => router.push("/scenarios")}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Another Scenario
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-10 py-4 bg-slate-700 text-slate-100 rounded-lg hover:bg-slate-600 transition-all font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}