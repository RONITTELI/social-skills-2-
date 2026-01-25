"use client";


import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [debug, setDebug] = useState({ raw: null, error: null });


  useEffect(() => {
    const userId = "69760c17f8229f9744b8039e";
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analysis?userId=${userId}`);
        const result = await res.json();
        setDebug({ raw: result, error: null });
        if (result.success && result.data) {
          setData({
            speech: {
              wpm: result.data.speech?.wpm || 0,
              fillerWords: result.data.speech?.fillerWords || 0,
              tone: result.data.speech?.tone || "N/A"
            },
            emotion: {
              dominant: result.data.emotion?.dominantEmotion || "N/A",
              eyeContact: result.data.emotion?.eyeContact || "N/A"
            },
            posture: {
              score: result.data.posture?.postureScore || 0,
              issues: Array.isArray(result.data.posture?.postureIssues) ? result.data.posture.postureIssues.length : 0
            }
          });
        } else {
          setData(null);
        }
      } catch (e) {
        setDebug({ raw: null, error: e.message });
        setData(null);
      }
    };
    fetchData();
  }, []);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div>Loading...</div>
      {debug.raw && (
        <pre className="mt-4 bg-gray-100 p-2 rounded text-xs max-w-2xl overflow-x-auto">{JSON.stringify(debug.raw, null, 2)}</pre>
      )}
      {debug.error && (
        <div className="mt-4 text-red-600">Error: {debug.error}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Performance <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-lg text-gray-600">
              Overview of your latest communication metrics.
            </p>
          </div>
          <Link 
            href="/feedback" 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            Get Comprehensive Feedback
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Speech Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Speech</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-gray-500">Pace</span> <span className="font-bold text-gray-900">{data.speech.wpm} WPM</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Fillers</span> <span className="font-bold text-gray-900">{data.speech.fillerWords}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Tone</span> <span className="font-bold text-gray-900 capitalize">{data.speech.tone}</span></div>
            </div>
          </div>

          {/* Emotion Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Emotion</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-gray-500">Dominant</span> <span className="font-bold text-gray-900 capitalize">{data.emotion.dominant}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Eye Contact</span> <span className="font-bold text-gray-900 capitalize">{data.emotion.eyeContact}</span></div>
            </div>
          </div>

          {/* Posture Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Posture</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-gray-500">Score</span> <span className="font-bold text-gray-900">{data.posture.score}/100</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Issues</span> <span className="font-bold text-gray-900">{data.posture.issues} Detected</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}