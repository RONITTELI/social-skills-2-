import React, { useRef, useEffect } from 'react';

// Import MediaPipe or TensorFlow.js libraries dynamically
// We'll use @mediapipe/pose for posture and @vladmandic/face-api for emotion (face detection)

export default function PostureEmotionDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let pose, faceapi, stream;
    let animationId;

    async function setup() {
      // Get webcam
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Load MediaPipe Pose
      const mpPose = await import('@mediapipe/pose');
      pose = new mpPose.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });
      pose.setOptions({ modelComplexity: 0, smoothLandmarks: true });
      pose.onResults(onPoseResults);

      // Load face-api.js
      faceapi = await import('face-api.js');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      // Start processing
      processFrame();
    }

    async function processFrame() {
      if (!videoRef.current) return;
      // Pose estimation
      await pose.send({ image: videoRef.current });
      // Face expression
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      drawFaceResults(detections);
      animationId = requestAnimationFrame(processFrame);
    }

    function onPoseResults(results) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (results.poseLandmarks) {
        // Draw pose landmarks
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        results.poseLandmarks.forEach((lm) => {
          ctx.beginPath();
          ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#00FF00';
          ctx.fill();
        });
      }
    }

    function drawFaceResults(detections) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      detections.forEach(det => {
        const { x, y, width, height } = det.detection.box;
        ctx.strokeStyle = '#00BFFF';
        ctx.strokeRect(x, y, width, height);
        // Draw emotion
        const expr = det.expressions;
        const topEmotion = Object.entries(expr).sort((a, b) => b[1] - a[1])[0];
        ctx.fillStyle = '#00BFFF';
        ctx.font = '16px Arial';
        ctx.fillText(topEmotion[0], x, y - 5);
      });
    }

    setup();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} width={480} height={360} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={480} height={360} style={{ border: '2px solid #333', background: '#111' }} />
      <p className="mt-4 text-slate-200">Live Posture & Emotion Detection Demo</p>
      <p className="text-xs text-slate-400">(Requires webcam access. Models must be available in /models.)</p>
    </div>
  );
}
