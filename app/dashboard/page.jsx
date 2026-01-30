"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";
const PostureEmotionDemo = dynamic(() => import("../../components/PostureEmotionDemo"), { ssr: false });


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
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-100 mb-2">
              Performance <span className="text-blue-400">Dashboard</span>
            </h1>
            <p className="text-lg text-slate-300">
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
        <div className="mb-10">
          <PostureEmotionDemo />
        </div>

        {/* Latest Metrics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Latest Speech Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Speech</h3>
            </div>
            {Array.isArray(data.speech) && data.speech.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-gray-500">Pace</span> <span className="font-bold text-gray-900">{data.speech[0].data?.wpm ?? '-' } WPM</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500">Fillers</span> <span className="font-bold text-gray-900">{data.speech[0].data?.fillerWords ?? '-'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500">Tone</span> <span className="font-bold text-gray-900 capitalize">{data.speech[0].data?.tone ?? '-'}</span></div>
                {data.speech[0].data?.transcript && (
                  <div className="mt-4">
                    <span className="text-gray-500">Transcript:</span>
                    <ExpandableText text={data.speech[0].data.transcript} maxLength={40} />
                  </div>
                )}
                {data.speech[0].data?.issues && data.speech[0].data.issues.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-500">Detected Issues:</span>
                    <ul className="list-disc ml-6 text-xs text-red-600">
                      {data.speech[0].data.issues.map((issue, idx) => (
                        <li key={idx}>{issue || 'N/A'}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : <div className="text-gray-400">No speech data.</div>}
          </div>

          {/* Latest Emotion Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Emotion</h3>
            </div>
            {Array.isArray(data.emotion) && data.emotion.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-gray-500">Dominant</span> <span className="font-bold text-gray-900 capitalize">{data.emotion[0].data?.dominantEmotion ?? '-'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500">Eye Contact</span> <span className="font-bold text-gray-900 capitalize">{data.emotion[0].data?.eyeContact ?? '-'}</span></div>
              </div>
            ) : <div className="text-gray-400">No emotion data.</div>}
          </div>

          {/* Latest Posture Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Posture</h3>
            </div>
            {Array.isArray(data.posture) && data.posture.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-gray-500">Score</span> <span className="font-bold text-gray-900">{data.posture[0].data?.postureScore ?? '-'}/100</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500">Issues</span> <span className="font-bold text-gray-900">{data.posture[0].data?.postureIssues?.length ?? 0} Detected</span></div>
                {data.posture[0].data?.postureIssues && data.posture[0].data.postureIssues.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-500">Details:</span>
                    <ul className="list-disc ml-6 text-xs text-blue-600">
                      {data.posture[0].data.postureIssues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : <div className="text-gray-400">No posture data.</div>}
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Speech History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded text-gray-900">
              <thead>
                <tr>
                  <th className="px-3 py-2 border">Date</th>
                  <th className="px-3 py-2 border">WPM</th>
                  <th className="px-3 py-2 border">Fillers</th>
                  <th className="px-3 py-2 border">Tone</th>
                  <th className="px-3 py-2 border">Transcript</th>
                  <th className="px-3 py-2 border">Issues</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(data.speech) && data.speech.length > 0) ? data.speech.map((item, idx) => (
                  <tr key={idx} className="text-xs text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => alert('Detail view coming soon!')}>
                    <td className="px-3 py-2 border">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</td>
                    <td className="px-3 py-2 border">{item.data?.wpm ?? 'N/A'}</td>
                    <td className="px-3 py-2 border">{item.data?.fillerWords ?? 'N/A'}</td>
                    <td className="px-3 py-2 border">{item.data?.tone ?? 'N/A'}</td>
                    <td className="px-3 py-2 border max-w-xs truncate" title={item.data?.transcript}>{item.data?.transcript?.slice(0, 40) ?? 'N/A'}</td>
                    <td className="px-3 py-2 border">
                      {item.data?.issues && item.data.issues.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {item.data.issues.map((issue, i) => <li key={i}>{issue || 'N/A'}</li>)}
                        </ul>
                      ) : 'None'}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center text-gray-400 py-4">No speech history available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Emotion History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr>
                  <th className="px-3 py-2 border text-gray-900">Date</th>
                  <th className="px-3 py-2 border text-gray-900">Dominant</th>
                  <th className="px-3 py-2 border text-gray-900">Eye Contact</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(data.emotion) && data.emotion.length > 0) ? data.emotion.map((item, idx) => (
                  <tr key={idx} className="text-xs text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => alert('Detail view coming soon!')}>
                    <td className="px-3 py-2 border">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</td>
                    <td className="px-3 py-2 border">{item.data?.dominantEmotion ?? 'N/A'}</td>
                    <td className="px-3 py-2 border">{item.data?.eyeContact ?? 'N/A'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="text-center text-gray-400 py-4">No emotion history available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Posture History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr>
                  <th className="px-3 py-2 border text-gray-900">Date</th>
                  <th className="px-3 py-2 border text-gray-900">Score</th>
                  <th className="px-3 py-2 border text-gray-900">Issues</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(data.posture) && data.posture.length > 0) ? data.posture.map((item, idx) => (
                  <tr key={idx} className="text-xs text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => alert('Detail view coming soon!')}>
                    <td className="px-3 py-2 border">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</td>
                    <td className="px-3 py-2 border">{item.data?.postureScore ?? 'N/A'}</td>
                    <td className="px-3 py-2 border">
                      {item.data?.postureIssues && item.data.postureIssues.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {item.data.postureIssues.map((issue, i) => <li key={i}>{issue || 'N/A'}</li>)}
                        </ul>
                      ) : 'None'}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="text-center text-gray-400 py-4">No posture history available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}