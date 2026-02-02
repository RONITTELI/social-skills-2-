import React, { useRef, useEffect, useState } from 'react';

// Use MediaPipe for both posture and facial analysis
export default function PostureEmotionDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    let poseLandmarker, faceLandmarker, stream;
    let animationId;

    async function setup() {
      try {
        setStatus('Setting up camera...');
        // Get webcam
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Load MediaPipe Vision tasks
        setStatus('Loading AI models...');
        const { PoseLandmarker, FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
        
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        );

        // Initialize Pose Landmarker
        poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numPoses: 1
        });

        // Initialize Face Landmarker
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1
        });

        setStatus('Ready - Live Demo');
        // Start processing
        processFrame();
      } catch (err) {
        console.error('Setup error:', err);
        setStatus('Error initializing: ' + err.message);
      }
    }

    async function processFrame() {
      if (!videoRef.current || !canvasRef.current) return;
      
      try {
        const startTimeMs = performance.now();
        
        // Get pose results
        const poseResults = poseLandmarker.detectForVideo(videoRef.current, startTimeMs);
        
        // Get face results
        const faceResults = faceLandmarker.detectForVideo(videoRef.current, startTimeMs);
        
        // Draw results
        drawResults(poseResults, faceResults);

        // Emit feedback events
        if (poseResults.landmarks && poseResults.landmarks.length > 0) {
          const feedback = analyzePosure(poseResults);
          window.dispatchEvent(new CustomEvent('postureFeedback', { detail: feedback }));
        }

        if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
          const feedback = analyzeFace(faceResults);
          window.dispatchEvent(new CustomEvent('emotionFeedback', { detail: feedback }));
        }
      } catch (err) {
        console.warn('Frame processing error:', err);
      }
      
      animationId = requestAnimationFrame(processFrame);
    }

    function analyzePosure(results) {
      const landmarks = results.landmarks[0];
      const feedback = [];
      let score = 100;
      const issues = [];

      if (!landmarks || landmarks.length < 33) return { feedback: ['Insufficient pose data'], overallScore: 0, issues };

      // Analyze posture based on landmarks (index references from MediaPipe Pose)
      const leftShoulder = landmarks[11]; // 11 = LEFT_SHOULDER
      const rightShoulder = landmarks[12]; // 12 = RIGHT_SHOULDER
      const leftEar = landmarks[7]; // 7 = LEFT_EAR
      const rightEar = landmarks[8]; // 8 = RIGHT_EAR
      const nose = landmarks[0]; // 0 = NOSE
      const leftHip = landmarks[23]; // 23 = LEFT_HIP
      const rightHip = landmarks[24]; // 24 = RIGHT_HIP

      // Check head tilt
      const earDiff = Math.abs(leftEar.y - rightEar.y);
      if (earDiff > 0.05) {
        feedback.push('⚠️ Head tilt detected. Keep your head level for better posture.');
        score -= 15;
        issues.push('head_tilt');
      } else {
        feedback.push('✓ Head position is level and balanced.');
      }

      // Check shoulder alignment
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      if (shoulderDiff > 0.08) {
        feedback.push('⚠️ Shoulders are uneven. Square your shoulders for better alignment.');
        score -= 12;
        issues.push('uneven_shoulders');
      } else {
        feedback.push('✓ Shoulders are well-aligned.');
      }

      // Check forward head posture (nose forward of shoulders)
      const noseX = nose.x;
      const shoulderX = (leftShoulder.x + rightShoulder.x) / 2;
      if (noseX > shoulderX + 0.05) {
        feedback.push('⚠️ Head is too forward. Bring your head back slightly.');
        score -= 10;
        issues.push('forward_head');
      } else {
        feedback.push('✓ Head position is good relative to shoulders.');
      }

      // Check hip alignment
      const hipDiff = Math.abs(leftHip.y - rightHip.y);
      if (hipDiff > 0.1) {
        feedback.push('⚠️ Hips are misaligned. Straighten your posture.');
        score -= 8;
        issues.push('misaligned_hips');
      } else {
        feedback.push('✓ Hips are properly aligned.');
      }

      score = Math.max(0, Math.min(100, score));

      return {
        feedback,
        overallScore: Math.round(score),
        issues,
        postureScore: Math.round(score),
        postureIssues: issues
      };
    }

    function analyzeFace(results) {
      const feedback = [];
      let score = 100;
      const issues = [];

      if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
        return { feedback: ['❌ No face detected'], overallScore: 0, issues };
      }

      const faceLandmarks = results.faceLandmarks[0];
      const faceBlendshapes = results.faceBlendshapes?.[0] || [];

      // Extract key facial landmarks for analysis
      const leftEye = faceLandmarks[33];     // LEFT_EYE
      const rightEye = faceLandmarks[263];   // RIGHT_EYE
      const noseTip = faceLandmarks[1];      // NOSE_TIP
      const leftMouth = faceLandmarks[61];   // LEFT_MOUTH_CORNER
      const rightMouth = faceLandmarks[291]; // RIGHT_MOUTH_CORNER
      const mouthCenter = faceLandmarks[0];  // FACE_CENTER

      // ===== EYE CONTACT ANALYSIS =====
      if (leftEye && rightEye) {
        const eyeDistance = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));
        const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
        
        if (eyeCenter.x < 0.35 || eyeCenter.x > 0.65) {
          feedback.push('⚠️ Eyes looking to the side. Direct more eye contact toward camera');
          score -= 12;
          issues.push('poor_eye_contact');
        } else if (eyeCenter.y < 0.3) {
          feedback.push('⚠️ Looking upward. Lower your gaze slightly toward camera');
          score -= 10;
          issues.push('eyes_up');
        } else if (eyeCenter.y > 0.6) {
          feedback.push('⚠️ Looking downward. Raise your gaze toward camera');
          score -= 10;
          issues.push('eyes_down');
        } else {
          feedback.push('✅ Good eye contact - looking directly at camera');
        }
      }

      // ===== HEAD POSITION ANALYSIS =====
      if (noseTip) {
        // Check if head is tilted left/right
        if (leftEye && rightEye) {
          const eyeLevelDiff = Math.abs(leftEye.y - rightEye.y);
          if (eyeLevelDiff > 0.04) {
            const tilt = leftEye.y < rightEye.y ? 'right' : 'left';
            feedback.push(`⚠️ Head tilted to ${tilt}. Straighten your head for better presence`);
            score -= 8;
            issues.push('head_tilt');
          }
        }

        // Check forward/backward head position
        const noseZ = noseTip.z || 0;
        if (noseZ < -0.1) {
          feedback.push('📹 Face too close to camera - step back slightly');
          score -= 5;
          issues.push('face_too_close');
        }
      }

      // ===== MOUTH & EXPRESSION ANALYSIS =====
      if (faceBlendshapes.length > 0) {
        let smileScore = 0;
        let mouthOpenScore = 0;
        let jawForwardScore = 0;
        let mouthWideScore = 0;
        let cheekRaiseScore = 0;

        faceBlendshapes.forEach((shape) => {
          if (shape.displayName?.includes('mouthSmile')) smileScore = Math.max(smileScore, shape.score);
          if (shape.displayName === 'mouthOpen') mouthOpenScore = shape.score;
          if (shape.displayName === 'jawForward') jawForwardScore = shape.score;
          if (shape.displayName === 'mouthUpperLeft' || shape.displayName === 'mouthUpperRight') mouthWideScore = Math.max(mouthWideScore, shape.score);
          if (shape.displayName?.includes('cheekRaise')) cheekRaiseScore = Math.max(cheekRaiseScore, shape.score);
        });

        // Smile feedback with actual scores
        if (smileScore > 0.7) {
          feedback.push(`😄 Great smile! (intensity: ${Math.round(smileScore * 100)}%) - very engaging for presentations`);
          score += 8;
        } else if (smileScore > 0.4) {
          feedback.push(`🙂 Light smile detected (${Math.round(smileScore * 100)}%). Consider a more confident smile`);
          score += 3;
        } else if (smileScore > 0.1) {
          feedback.push('😐 Subtle expression. Add more warmth to your smile');
          score -= 5;
          issues.push('weak_smile');
        } else {
          feedback.push('😶 Neutral/serious expression. A smile helps build rapport');
          score -= 10;
          issues.push('no_smile');
        }

        // Mouth opening for speech clarity
        if (mouthOpenScore > 0.6) {
          feedback.push(`💬 Mouth wide open (${Math.round(mouthOpenScore * 100)}%) - good articulation`);
        } else if (mouthOpenScore > 0.3) {
          feedback.push(`🗣️ Moderate mouth opening (${Math.round(mouthOpenScore * 100)}%) - acceptable for speech`);
        } else if (mouthOpenScore > 0.05) {
          feedback.push(`🤐 Mouth mostly closed (${Math.round(mouthOpenScore * 100)}%) - open more for clarity`);
          score -= 5;
          issues.push('mouth_closed');
        }

        // Cheek raise (indicates genuine smile)
        if (cheekRaiseScore > 0.5 && smileScore > 0.4) {
          feedback.push('✨ Genuine smile detected with cheek engagement - excellent!');
          score += 5;
        }

        // Jaw position
        if (jawForwardScore > 0.4) {
          feedback.push('⚠️ Jaw jutting forward - relax your jaw for natural expression');
          score -= 5;
          issues.push('jaw_forward');
        }
      }

      // ===== OVERALL FACIAL ENGAGEMENT =====
      if (issues.length === 0 && score >= 90) {
        feedback.push('🌟 Excellent! Your face conveys confidence and warmth');
      } else if (issues.length === 0 && score >= 75) {
        feedback.push('✨ Good presentation - you look engaged and professional');
      }

      score = Math.max(0, Math.min(100, score));

      // Determine dominant emotion based on feedback
      let dominantEmotion = 'neutral';
      if (feedback.some(f => f.includes('Great smile') || f.includes('Genuine smile'))) {
        dominantEmotion = 'happy';
      } else if (feedback.some(f => f.includes('weak_smile') || f.includes('no_smile'))) {
        dominantEmotion = 'serious';
      }

      // Determine eye contact quality
      let eyeContact = 'good';
      if (issues.includes('poor_eye_contact') || issues.includes('eyes_down') || issues.includes('eyes_up')) {
        eyeContact = 'poor';
      }

      return {
        feedback,
        overallScore: Math.round(score),
        issues,
        dominantEmotion,
        eyeContact
      };
    }

    function drawResults(poseResults, faceResults) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // Draw video frame
      ctx.drawImage(videoRef.current, 0, 0, width, height);

      // Draw pose landmarks (green)
      if (poseResults.landmarks && poseResults.landmarks.length > 0) {
        const landmarks = poseResults.landmarks[0];
        ctx.strokeStyle = '#00FF00';
        ctx.fillStyle = '#00FF00';
        ctx.lineWidth = 2;

        // Draw skeleton connections
        const connections = [
          [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // arms
          [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28] // torso and legs
        ];

        connections.forEach(([start, end]) => {
          const startLm = landmarks[start];
          const endLm = landmarks[end];
          if (startLm && endLm) {
            ctx.beginPath();
            ctx.moveTo(startLm.x * width, startLm.y * height);
            ctx.lineTo(endLm.x * width, endLm.y * height);
            ctx.stroke();
          }
        });

        // Draw landmarks
        landmarks.forEach((lm, i) => {
          ctx.beginPath();
          ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // Draw face landmarks (cyan)
      if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
        const faceLandmarks = faceResults.faceLandmarks[0];
        ctx.strokeStyle = '#00BFFF';
        ctx.fillStyle = '#00BFFF';
        ctx.lineWidth = 1;

        // Draw face landmarks
        faceLandmarks.forEach((lm) => {
          ctx.beginPath();
          ctx.arc(lm.x * width, lm.y * height, 2, 0, 2 * Math.PI);
          ctx.fill();
        });

        // Draw face detection box (approximate from landmarks)
        const xs = faceLandmarks.map(lm => lm.x * width);
        const ys = faceLandmarks.map(lm => lm.y * height);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      }
    }

    setup();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <video ref={videoRef} width={480} height={360} style={{ display: 'none' }} />
        <canvas 
          ref={canvasRef} 
          width={480} 
          height={360} 
          style={{ border: '2px solid #555', background: '#000', borderRadius: '8px' }} 
        />
        <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded text-sm text-slate-300">
          {status}
        </div>
      </div>
      <div className="text-center">
        <p className="text-slate-200 font-medium">Live Posture & Emotion Detection Demo</p>
        <p className="text-xs text-slate-400 mt-1">Green: Posture · Cyan: Face</p>
      </div>
    </div>
  );
}
