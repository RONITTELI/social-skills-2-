"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [promptData, setPromptData] = useState<{ title: string; prompt: string } | null>(null);
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // Check authorization
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    const saved = localStorage.getItem("scenario");
    const analyses = localStorage.getItem("selectedAnalyses");
    if (saved) {
      setPromptData(JSON.parse(saved));
    }
    if (analyses) {
      setSelectedAnalyses(JSON.parse(analyses));
    }
  }, [router]);

  async function startRecording() {
    setTimer(0);
    setTranscript("");
    setVideoURL("");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    // Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };
      recognition.start();
    }

    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  }

  function stopRecording() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);

    const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
    tracks?.forEach((track) => track.stop());
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button onClick={() => router.push('/scenarios')} className="text-slate-400 hover:text-slate-200 mb-4 flex items-center gap-2 transition font-medium">
            <span>←</span> Back to Scenarios
          </button>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-100">Record Your Response</h1>
        </div>

        {promptData && (
          <div className="card p-6 mb-8">
            <h2 className="font-bold text-xl text-slate-100 mb-2">{promptData.title}</h2>
            <p className="text-slate-300 text-lg">{promptData.prompt}</p>
            {selectedAnalyses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Analyses to run:</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedAnalyses.includes('speech') && <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">Speech</span>}
                  {selectedAnalyses.includes('emotion') && <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Emotion</span>}
                  {selectedAnalyses.includes('posture') && <span className="inline-block px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-sm">Posture</span>}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-xl p-4 shadow-2xl">
              <video
                ref={videoRef}
                className="w-full aspect-video bg-black rounded-lg"
                muted
              ></video>
            </div>

            {videoURL && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-100 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preview
                </h2>
                <div className="bg-slate-900 rounded-xl p-4 shadow-2xl">
                  <video src={videoURL} controls className="w-full aspect-video rounded-lg" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Recording Time</p>
                  <p className="text-3xl font-bold text-blue-400">{timer}s</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Live Transcript
              </h3>
              <div className="bg-slate-700/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-slate-300 leading-relaxed text-sm">{transcript || "Start speaking to see transcript..."}</p>
              </div>
            </div>

            <div className="space-y-3">
              {!recording ? (
                <button
                  onClick={startRecording}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-xl transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-xl transition-all shadow-lg font-semibold flex items-center justify-center gap-2 animate-pulse"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                  Stop Recording
                </button>
              )}

              {videoURL && (
                <button
                  onClick={() => {
                    localStorage.setItem("transcript", transcript);
                    localStorage.setItem("duration", timer.toString());
                    localStorage.setItem("videoURL", videoURL);
                    router.push("/analysis");
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-xl transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Continue to Analysis
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
