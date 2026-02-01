"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { analyzeSpeech } from "@/lib/speechAnalysis";

const PostureEmotionDemo = dynamic(() => import("@/components/PostureEmotionDemo"), { ssr: false });

const scenarios = [
  { id: 1, title: "Job Interview", prompt: "Tell me about yourself in 30 seconds." },
  { id: 2, title: "Networking Event", prompt: "Introduce yourself to a new contact." },
  { id: 3, title: "Team Presentation", prompt: "Present your project to the team." },
  { id: 4, title: "Client Call", prompt: "Explain a solution to your client." },
  { id: 5, title: "Difficult Conversation", prompt: "Address a conflict with a colleague professionally." },
  { id: 6, title: "Impromptu Speech", prompt: "Give an impromptu talk on your expertise." },
  { id: 7, title: "Sales Pitch", prompt: "Pitch your product or idea to an investor." },
  { id: 8, title: "Leadership Meeting", prompt: "Lead a brief team standup meeting." },
];

export default function ScenariosPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const speechStartTimeRef = useRef<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLiveAnalysis, setShowLiveAnalysis] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  // Listen for feedback from PostureEmotionDemo
  useEffect(() => {
    const handlePostureFeedback = (event: any) => {
      setFeedback((prev: any) => ({ ...prev, posture: event.detail }));
    };
    const handleEmotionFeedback = (event: any) => {
      setFeedback((prev: any) => ({ ...prev, emotion: event.detail }));
    };
    const handleSpeechFeedback = (event: any) => {
      setFeedback((prev: any) => ({ ...prev, speech: event.detail }));
    };

    window.addEventListener("postureFeedback", handlePostureFeedback);
    window.addEventListener("emotionFeedback", handleEmotionFeedback);
    window.addEventListener("speechFeedback", handleSpeechFeedback);
    
    return () => {
      window.removeEventListener("postureFeedback", handlePostureFeedback);
      window.removeEventListener("emotionFeedback", handleEmotionFeedback);
      window.removeEventListener("speechFeedback", handleSpeechFeedback);
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (!isRecording || !selectedAnalyses.includes("speech")) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore stop errors
        }
        speechRecognitionRef.current = null;
      }
      speechStartTimeRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    speechRecognitionRef.current = recognition;
    if (!speechStartTimeRef.current) speechStartTimeRef.current = Date.now();

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript + " ";
      }

      const durationSec = Math.max(1, (Date.now() - (speechStartTimeRef.current || Date.now())) / 1000);
      const metrics = analyzeSpeech(transcript, durationSec);

      const feedback: string[] = [];
      const issues: string[] = [];
      let score = 100;

      if (metrics.wpm === 0) {
        feedback.push("🗣️ Start speaking to get live speech feedback");
        score = 0;
      } else {
        feedback.push(`📈 Pacing: ${metrics.wpm} WPM`);
        if (metrics.wpm < 110) {
          feedback.push("⚠️ You are speaking slowly. Try to increase your pace slightly.");
          score -= 10;
          issues.push("slow_pacing");
        } else if (metrics.wpm > 170) {
          feedback.push("⚠️ You are speaking fast. Slow down for better clarity.");
          score -= 10;
          issues.push("fast_pacing");
        } else {
          feedback.push("✅ Good speaking pace");
        }

        if (metrics.fillerWords > 0) {
          feedback.push(`⚠️ Filler words: ${metrics.fillerWords} (reduce for confidence)`);
          score -= Math.min(20, metrics.fillerWords * 2);
          issues.push("filler_words");
        } else {
          feedback.push("✅ No filler words detected");
        }
      }

      score = Math.max(0, Math.min(100, Math.round(score)));
      window.dispatchEvent(new CustomEvent("speechFeedback", { detail: { feedback, overallScore: score, issues } }));
    };

    recognition.onerror = () => {
      window.dispatchEvent(new CustomEvent("speechFeedback", { detail: { feedback: ["⚠️ Speech recognition error"], overallScore: 0, issues: ["speech_error"] } }));
    };

    recognition.onend = () => {
      if (isRecording && selectedAnalyses.includes("speech")) {
        try {
          recognition.start();
        } catch {
          // ignore restart errors
        }
      }
    };

    try {
      recognition.start();
    } catch {
      // ignore start errors
    }

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore stop errors
      }
    };
  }, [isRecording, selectedAnalyses]);

  const handleToggleAnalysis = (analysis: string) => {
    setSelectedAnalyses((prev) =>
      prev.includes(analysis)
        ? prev.filter((item) => item !== analysis)
        : [...prev, analysis]
    );
  };

  const startLiveAnalysis = () => {
    if (selectedAnalyses.length === 0) return;
    setFeedback(null);
    setIsRecording(true);
  };

  const stopLiveAnalysis = () => {
    setIsRecording(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-100">
            Practice <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Scenarios</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Select analyses, check a box, and get live feedback
          </p>
        </div>

        {/* Back Button - Show when scenario selected */}
        {selectedScenario && (
          <div className="max-w-4xl mx-auto mb-8">
            <button
              onClick={() => {
                setSelectedScenario(null);
                setShowLiveAnalysis(false);
                setIsRecording(false);
                setSelectedAnalyses([]);
                setFeedback(null);
              }}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition font-semibold"
            >
              ← Back to Scenarios
            </button>
          </div>
        )}

        {/* Analysis Selector - Only show after selecting a scenario */}
        {selectedScenario && (
          <div className="max-w-4xl mx-auto mb-12 bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-100">Scenario: <span className="text-cyan-400">{selectedScenario.title}</span></h2>
              <p className="text-slate-400 italic">"{selectedScenario.prompt}"</p>
            </div>
            <h3 className="text-xl font-bold mb-6 text-slate-100">Select Analysis Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {["speech", "emotion", "posture"].map((analysis) => (
                <label
                  key={analysis}
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition border-2 ${
                    selectedAnalyses.includes(analysis)
                      ? "bg-blue-500/20 border-blue-500"
                      : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAnalyses.includes(analysis)}
                    onChange={() => handleToggleAnalysis(analysis)}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-100 capitalize">{analysis}</span>
                </label>
              ))}
            </div>

            {!showLiveAnalysis ? (
              <button
                onClick={() => {
                  setShowLiveAnalysis(true);
                  startLiveAnalysis();
                }}
                disabled={selectedAnalyses.length === 0}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Start Live Analysis
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLiveAnalysis(false);
                  stopLiveAnalysis();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
              >
                Stop Analysis
              </button>
            )}
          </div>
        )}

        {/* Live Analysis View */}
        {showLiveAnalysis && (
          <div className="max-w-6xl mx-auto mb-12 bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-100">🎯 Live Feedback</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video + Demo */}
              <div className="space-y-6">
                {(selectedAnalyses.includes("posture") || selectedAnalyses.includes("emotion")) && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-4 text-slate-100">Live Skeleton & Emotion Detection</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      {isRecording && <PostureEmotionDemo />}
                      {!isRecording && (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          Click Start Live Analysis to begin
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedAnalyses.includes("speech") && !selectedAnalyses.includes("posture") && !selectedAnalyses.includes("emotion") && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-4 text-slate-100">Live Video Feed</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                      {!isRecording && <p className="text-slate-400">Click Start Live Analysis to begin</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              <div className="space-y-4">
                {!isRecording ? (
                  <button
                    onClick={startLiveAnalysis}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <span>▶</span> Start Live Analysis
                  </button>
                ) : (
                  <button
                    onClick={stopLiveAnalysis}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 animate-pulse"
                  >
                    <span>◼</span> Stop Live Analysis
                  </button>
                )}

                {(feedback || selectedAnalyses.includes("speech")) && (
                  <div className="bg-slate-700/50 rounded-lg p-6 max-h-96 overflow-y-auto space-y-4">
                    {feedback?.posture && (
                      <div className="pb-4 border-b border-slate-600">
                        <h5 className="text-blue-400 font-bold mb-2">🧍 Posture Feedback</h5>
                        <div className="space-y-1 text-xs text-slate-300">
                          {feedback.posture.feedback?.map((item: string, i: number) => (
                            <p key={i}>• {item}</p>
                          ))}
                        </div>
                        <p className="text-slate-500 text-xs mt-2">Score: <span className="text-blue-400 font-bold">{feedback.posture.overallScore}/100</span></p>
                      </div>
                    )}

                    {feedback?.emotion && (
                      <div className="pb-4 border-b border-slate-600">
                        <h5 className="text-purple-400 font-bold mb-2">😊 Emotion Feedback</h5>
                        <div className="space-y-1 text-xs text-slate-300">
                          {feedback.emotion.feedback?.map((item: string, i: number) => (
                            <p key={i}>• {item}</p>
                          ))}
                        </div>
                        <p className="text-slate-500 text-xs mt-2">Score: <span className="text-purple-400 font-bold">{feedback.emotion.overallScore}/100</span></p>
                      </div>
                    )}

                    {selectedAnalyses.includes("speech") && (
                      <div>
                        <h5 className="text-cyan-400 font-bold mb-2">🎤 Speech Feedback</h5>
                        {feedback?.speech ? (
                          <>
                            <div className="space-y-1 text-xs text-slate-300">
                              {feedback.speech.feedback?.map((item: string, i: number) => (
                                <p key={i}>• {item}</p>
                              ))}
                            </div>
                            <p className="text-slate-500 text-xs mt-2">Score: <span className="text-cyan-400 font-bold">{feedback.speech.overallScore}/100</span></p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-400">Start speaking to get live speech feedback.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scenario Cards - Show first */}
        {!selectedScenario && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-slate-100">Select a Scenario</h2>
              <p className="text-slate-400">Choose a scenario to practice and get live feedback</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className="group relative h-full p-6 card text-left overflow-hidden hover:scale-105 transition-transform"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex flex-col h-full">
                    <div className="w-10 h-10 mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">{scenario.id}</span>
                    </div>
                    <h2 className="text-lg font-bold mb-2 text-slate-100">{scenario.title}</h2>
                    <p className="text-slate-400 text-xs mb-3 flex-grow">{scenario.prompt}</p>
                    <p className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform text-sm">
                      Select →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
