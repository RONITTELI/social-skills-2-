"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [promptData, setPromptData] = useState<{ title: string; prompt: string } | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("scenario");
    if (saved) {
      setPromptData(JSON.parse(saved));
    }
  }, []);

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
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
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-4">Record Your Response</h1>

      {promptData && (
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <h2 className="font-semibold text-lg">{promptData.title}</h2>
          <p className="text-gray-600">{promptData.prompt}</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full max-w-xl bg-black rounded-xl shadow-md"
        muted
      ></video>

      <p className="text-lg mt-3">⏱ Timer: {timer}s</p>

      <div className="mt-4">
        <h3 className="font-semibold text-lg">Transcript:</h3>
        <p className="text-gray-700 p-4 bg-gray-200 rounded-xl">{transcript || "..."}</p>
      </div>

      <div className="flex gap-4 mt-6">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Stop Recording
          </button>
        )}
      </div>

      {videoURL && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Preview</h2>
          <video src={videoURL} controls className="w-full max-w-xl mt-2 rounded-xl shadow-md" />
        </div>
      )}

      {videoURL && (
        <button
          onClick={() => {
            localStorage.setItem("transcript", transcript);
            localStorage.setItem("duration", timer.toString());
            router.push("/analysis");
          }}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Continue to Analysis
        </button>
      )}
    </div>
  );
}
