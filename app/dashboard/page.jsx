"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ExpandableText from "./ExpandableText";


export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [debug, setDebug] = useState({ raw: null, error: null });
  const [activeTab, setActiveTab] = useState("scenarios");


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analysis?userId=${userId}`);
        const result = await res.json();
        setDebug({ raw: result, error: null });
        if (result.success && result.data) {
          setData({
            speech: result.data.speech || [],
            emotion: result.data.emotion || [],
            posture: result.data.posture || []
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
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -top-20 right-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Performance Dashboard
              </span>
            </h1>
            <p className="text-xl bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              All your communication metrics in one place
            </p>
          </div>
          <Link 
            href="/feedback" 
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Get Feedback
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Module Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("scenarios")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap shadow-lg ${
              activeTab === "scenarios"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/50 scale-105"
                : "bg-slate-800/80 backdrop-blur text-slate-300 hover:bg-slate-700/80 hover:scale-105 border border-slate-700"
            }`}
          >
            📋 Practice Scenarios
          </button>
          <button
            onClick={() => setActiveTab("emotion")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap shadow-lg ${
              activeTab === "emotion"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50 scale-105"
                : "bg-slate-800/80 backdrop-blur text-slate-300 hover:bg-slate-700/80 hover:scale-105 border border-slate-700"
            }`}
          >
            😊 Emotion Detection
          </button>
          <button
            onClick={() => setActiveTab("posture")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap shadow-lg ${
              activeTab === "posture"
                ? "bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-orange-500/50 scale-105"
                : "bg-slate-800/80 backdrop-blur text-slate-300 hover:bg-slate-700/80 hover:scale-105 border border-slate-700"
            }`}
          >
            🧍 Posture Analysis
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap shadow-lg ${
              activeTab === "all"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/50 scale-105"
                : "bg-slate-800/80 backdrop-blur text-slate-300 hover:bg-slate-700/80 hover:scale-105 border border-slate-700"
            }`}
          >
            📊 All Data
          </button>
        </div>

        {/* Practice Scenarios Section */}
        {(activeTab === "scenarios" || activeTab === "all") && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              📋 Practice Scenarios Module
            </h2>
            
            {/* Latest Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Latest Speech */}
              {Array.isArray(data.speech) && data.speech.filter(item => item.scenarioTitle).length > 0 && (
                <div className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur border border-blue-400/30 p-6 rounded-2xl hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-blue-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </div>
                    <h3 className="font-bold text-blue-200 text-lg">Latest Speech</h3>
                  </div>
                  <div className="text-sm text-cyan-300 mb-3">
                    <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-lg font-semibold">
                      {data.speech.filter(item => item.scenarioTitle)[0]?.scenarioTitle}
                    </span>
                  </div>
                  <div className="space-y-2 text-blue-100">
                    <div className="flex justify-between"><span className="text-cyan-300">WPM</span><span className="font-bold text-white">{data.speech.filter(item => item.scenarioTitle)[0]?.data?.wpm ?? '-'}</span></div>
                    <div className="flex justify-between"><span className="text-cyan-300">Fillers</span><span className="font-bold text-white">{data.speech.filter(item => item.scenarioTitle)[0]?.data?.fillerWords ?? '-'}</span></div>
                  </div>
                </div>
              )}

              {/* Latest Emotion */}
              {Array.isArray(data.emotion) && data.emotion.filter(item => item.scenarioTitle).length > 0 && (
                <div className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-400/30 p-6 rounded-2xl hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="font-bold text-purple-200 text-lg">Latest Emotion</h3>
                  </div>
                  <div className="text-sm text-pink-300 mb-3">
                    <span className="bg-purple-400/30 text-purple-100 px-3 py-1 rounded-lg font-semibold">
                      {data.emotion.filter(item => item.scenarioTitle)[0]?.scenarioTitle}
                    </span>
                  </div>
                  <div className="space-y-2 text-purple-100">
                    <div className="flex justify-between"><span className="text-pink-300">Emotion</span><span className="font-bold text-white capitalize">{data.emotion.filter(item => item.scenarioTitle)[0]?.data?.dominantEmotion ?? '-'}</span></div>
                    <div className="flex justify-between"><span className="text-pink-300">Eye Contact</span><span className="font-bold text-white capitalize">{data.emotion.filter(item => item.scenarioTitle)[0]?.data?.eyeContact ?? '-'}</span></div>
                  </div>
                </div>
              )}

              {/* Latest Posture */}
              {Array.isArray(data.posture) && data.posture.filter(item => item.scenarioTitle).length > 0 && (
                <div className="group bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur border border-orange-400/30 p-6 rounded-2xl hover:from-orange-500/30 hover:to-yellow-500/30 hover:border-orange-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h3 className="font-bold text-orange-200 text-lg">Latest Posture</h3>
                  </div>
                  <div className="text-sm text-yellow-300 mb-3">
                    <span className="bg-orange-400/30 text-orange-100 px-3 py-1 rounded-lg font-semibold">
                      {data.posture.filter(item => item.scenarioTitle)[0]?.scenarioTitle}
                    </span>
                  </div>
                  <div className="space-y-2 text-orange-100">
                    <div className="flex justify-between"><span className="text-yellow-300">Score</span><span className="font-bold text-white">{data.posture.filter(item => item.scenarioTitle)[0]?.data?.postureScore ?? '-'}/100</span></div>
                    <div className="flex justify-between"><span className="text-yellow-300">Issues</span><span className="font-bold text-white">{data.posture.filter(item => item.scenarioTitle)[0]?.data?.postureIssues?.length ?? 0}</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Scenarios History Table */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-blue-500/30 rounded-2xl p-6 shadow-2xl hover:border-blue-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Practice Scenarios History
              </h3>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-slate-800">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Scenario</th>
                      <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Score</th>
                      <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.speech.filter(item => item.scenarioTitle), 
                      ...data.emotion.filter(item => item.scenarioTitle), 
                      ...data.posture.filter(item => item.scenarioTitle)]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 10)
                      .map((item, idx) => {
                        const type = item.data.wpm !== undefined ? 'Speech' : item.data.dominantEmotion !== undefined ? 'Emotion' : 'Posture';
                        const score = item.data.overallScore || item.data.postureScore || 'N/A';
                        return (
                          <tr key={idx} className="text-sm border-b border-slate-700/50 hover:bg-blue-500/10 transition-all cursor-pointer group">
                            <td className="px-4 py-3 text-slate-300 group-hover:text-white">{new Date(item.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-400/30">
                                {item.scenarioTitle}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-300 group-hover:text-white font-medium">{type}</td>
                            <td className="px-4 py-3 text-blue-300 group-hover:text-blue-200 font-bold">{score}</td>
                            <td className="px-4 py-3 text-slate-400 group-hover:text-slate-300">
                              {type === 'Speech' && `${item.data.wpm} WPM, ${item.data.fillerWords} fillers`}
                              {type === 'Emotion' && `${item.data.dominantEmotion}, ${item.data.eyeContact} eye contact`}
                              {type === 'Posture' && `${item.data.postureIssues?.length || 0} issues`}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Emotion Detection Section */}
        {(activeTab === "emotion" || activeTab === "all") && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              😊 Emotion Detection Module
            </h2>
            
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-purple-500/30 rounded-2xl p-6 shadow-2xl hover:border-purple-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Emotion Analysis History
              </h3>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-800">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-4 py-3 text-left text-pink-300 font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-pink-300 font-semibold">Source</th>
                      <th className="px-4 py-3 text-left text-pink-300 font-semibold">Score</th>
                      <th className="px-4 py-3 text-left text-pink-300 font-semibold">Emotion</th>
                      <th className="px-4 py-3 text-left text-pink-300 font-semibold">Eye Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(data.emotion) && data.emotion.length > 0) ? data.emotion.map((item, idx) => (
                      <tr key={idx} className="text-sm border-b border-slate-700/50 hover:bg-purple-500/10 transition-all cursor-pointer group">
                        <td className="px-4 py-3 text-slate-300 group-hover:text-white">{new Date(item.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {item.scenarioTitle ? (
                            <span className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-3 py-1 rounded-lg font-semibold border border-purple-400/30">
                              {item.scenarioTitle}
                            </span>
                          ) : (
                            <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-lg font-semibold border border-slate-600">
                              Standalone
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-purple-300 group-hover:text-purple-200 font-bold">{item.data?.overallScore ?? 'N/A'}/100</td>
                        <td className="px-4 py-3 text-slate-300 group-hover:text-white capitalize font-medium">{item.data?.dominantEmotion ?? 'N/A'}</td>
                        <td className="px-4 py-3 text-slate-300 group-hover:text-white capitalize font-medium">{item.data?.eyeContact ?? 'N/A'}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center text-slate-500 py-8">No emotion history available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Posture Analysis Section */}
        {(activeTab === "posture" || activeTab === "all") && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
              🧍 Posture Analysis Module
            </h2>
            
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-orange-500/30 rounded-2xl p-6 shadow-2xl hover:border-orange-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
                Posture Analysis History
              </h3>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-800">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-4 py-3 text-left text-yellow-300 font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-yellow-300 font-semibold">Source</th>
                      <th className="px-4 py-3 text-left text-yellow-300 font-semibold">Score</th>
                      <th className="px-4 py-3 text-left text-yellow-300 font-semibold">Issues Found</th>
                      <th className="px-4 py-3 text-left text-yellow-300 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(data.posture) && data.posture.length > 0) ? data.posture.map((item, idx) => (
                      <tr key={idx} className="text-sm border-b border-slate-700/50 hover:bg-orange-500/10 transition-all cursor-pointer group">
                        <td className="px-4 py-3 text-slate-300 group-hover:text-white">{new Date(item.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {item.scenarioTitle ? (
                            <span className="bg-gradient-to-r from-orange-500/30 to-yellow-500/30 text-orange-200 px-3 py-1 rounded-lg font-semibold border border-orange-400/30">
                              {item.scenarioTitle}
                            </span>
                          ) : (
                            <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-lg font-semibold border border-slate-600">
                              Standalone
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-orange-300 group-hover:text-orange-200 font-bold">{item.data?.postureScore ?? 'N/A'}/100</td>
                        <td className="px-4 py-3 text-slate-300 group-hover:text-white font-medium">{item.data?.postureIssues?.length ?? 0}</td>
                        <td className="px-4 py-3 text-slate-400 group-hover:text-slate-300">
                          {item.data?.postureIssues && item.data.postureIssues.length > 0 ? (
                            <ul className="list-disc ml-4 space-y-1">
                              {item.data.postureIssues.slice(0, 3).map((issue, i) => <li key={i}>{issue}</li>)}
                            </ul>
                          ) : 'None'}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center text-slate-500 py-8">No posture history available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* All Data Section - Legacy Tables */}
        {activeTab === "all" && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 bg-clip-text text-transparent">
              📊 Complete Data History
            </h2>
            
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Speech History
              </h3>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-cyan-500/30 rounded-2xl p-6 shadow-2xl hover:border-cyan-400/50 transition-all duration-300">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-slate-800">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Date</th>
                        <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Scenario</th>
                        <th className="px-4 py-3 text-left text-cyan-300 font-semibold">WPM</th>
                        <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Fillers</th>
                        <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Tone</th>
                        <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Transcript</th>
                        <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(data.speech) && data.speech.length > 0) ? data.speech.map((item, idx) => (
                        <tr key={idx} className="text-sm border-b border-slate-700/50 hover:bg-cyan-500/10 transition-all cursor-pointer group">
                          <td className="px-4 py-3 text-slate-300 group-hover:text-white">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</td>
                          <td className="px-4 py-3">
                            {item.scenarioTitle ? (
                              <span className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-400/30">
                                {item.scenarioTitle}
                              </span>
                            ) : <span className="text-slate-500">N/A</span>}
                          </td>
                          <td className="px-4 py-3 text-cyan-300 group-hover:text-cyan-200 font-bold">{item.data?.wpm ?? 'N/A'}</td>
                          <td className="px-4 py-3 text-slate-300 group-hover:text-white">{item.data?.fillerWords ?? 'N/A'}</td>
                          <td className="px-4 py-3 text-slate-300 group-hover:text-white capitalize">{item.data?.tone ?? 'N/A'}</td>
                          <td className="px-4 py-3 text-slate-400 group-hover:text-slate-300 max-w-xs truncate" title={item.data?.transcript}>{item.data?.transcript?.slice(0, 40) ?? 'N/A'}</td>
                          <td className="px-4 py-3 text-red-400">
                            {item.data?.issues && item.data.issues.length > 0 ? (
                              <ul className="list-disc ml-4 space-y-1">
                                {item.data.issues.map((issue, i) => <li key={i}>{issue || 'N/A'}</li>)}
                              </ul>
                            ) : <span className="text-green-400">None</span>}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={7} className="text-center text-slate-500 py-8">No speech history available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}