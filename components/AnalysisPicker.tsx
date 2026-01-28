"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AnalysisPickerProps {
  scenarioTitle: string;
  scenarioPrompt: string;
  onClose: () => void;
}

export default function AnalysisPicker({
  scenarioTitle,
  scenarioPrompt,
  onClose,
}: AnalysisPickerProps) {
  const router = useRouter();
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([
    "speech",
    "emotion",
    "posture",
  ]);

  const analyses = [
    {
      id: "speech",
      name: "Speech Analysis",
      description: "Analyze WPM, filler words, clarity, and speech patterns",
      icon: "🎤",
    },
    {
      id: "emotion",
      name: "Emotion Detection",
      description: "Detect facial expressions and emotional states",
      icon: "😊",
    },
    {
      id: "posture",
      name: "Posture Analysis",
      description: "Analyze body positioning and gestures",
      icon: "🧍",
    },
  ];

  const handleToggle = (id: string) => {
    setSelectedAnalyses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    localStorage.setItem("scenario", JSON.stringify({ title: scenarioTitle, prompt: scenarioPrompt }));
    localStorage.setItem("selectedAnalyses", JSON.stringify(selectedAnalyses));
    router.push("/prompt");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-2xl w-full">
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100">
            Select Analysis Tools
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 mb-6">
            <span className="font-semibold text-slate-100">{scenarioTitle}</span>
            {" "}
            - Choose which analyses to run on your recording.
          </p>

          <div className="grid gap-4 mb-8">
            {analyses.map((analysis) => (
              <label
                key={analysis.id}
                className="flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg cursor-pointer transition border border-slate-600/50"
              >
                <input
                  type="checkbox"
                  checked={selectedAnalyses.includes(analysis.id)}
                  onChange={() => handleToggle(analysis.id)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{analysis.icon}</span>
                    <h3 className="font-semibold text-slate-100">
                      {analysis.name}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400">{analysis.description}</p>
                </div>
              </label>
            ))}
          </div>

          {selectedAnalyses.length === 0 && (
            <p className="text-sm text-yellow-400 mb-6 flex items-center gap-2">
              <span>⚠️</span> Select at least one analysis to proceed.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/50 rounded-b-2xl flex gap-3 justify-end border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={selectedAnalyses.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
