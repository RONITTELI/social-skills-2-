"use client";
import Link from "next/link";
import { useState } from "react";
import AnalysisPicker from "@/components/AnalysisPicker";

const scenarios = [
  { id: 1, title: "Job Interview", prompt: "Tell me about yourself in 30 seconds." },
  { id: 2, title: "Networking Event", prompt: "Introduce yourself to a new contact." },
  { id: 3, title: "Team Presentation", prompt: "Present your project to the team." },
  { id: 4, title: "Client Call", prompt: "Explain a solution to your client." },
];

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-100">
            Select a <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Scenario</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Choose a scenario to practice your communication skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className="group relative h-full p-8 card text-left overflow-hidden hover:scale-105 transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col h-full">
                <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">{scenario.id}</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-slate-100">{scenario.title}</h2>
                <p className="text-slate-400 text-sm mb-4 flex-grow">{scenario.prompt}</p>
                <p className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Start training →
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedScenario && (
        <AnalysisPicker
          scenarioTitle={selectedScenario.title}
          scenarioPrompt={selectedScenario.prompt}
          onClose={() => setSelectedScenario(null)}
        />
      )}
    </div>
  );
}
