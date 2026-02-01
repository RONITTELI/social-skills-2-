// Suppress specific TF Lite info messages
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) {
    return;
  }
  originalConsoleError(...args);
};

let poseLandmarker;
let runningMode = "VIDEO";

// Initialize the landmarker using improved @mediapipe/tasks-vision
async function createPoseLandmarker() {
  const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
      delegate: "GPU"
    },
    runningMode: runningMode,
    numPoses: 1
  });
  console.log("Pose landmarker created successfully");
}

export async function analyzePostureCues(videoElement) {
  if (!poseLandmarker) {
    console.log("Initializing pose landmarker...");
    await createPoseLandmarker();
    if(!poseLandmarker) {
        console.error("PoseLandmarker not created after wait.");
        return {
          postureScore: 0,
          postureIssues: ["Analysis failed"],
          postureDetails: []
        };
    }
  }

  let goodPostureFrames = 0;
  let frameCount = 0;
  let issuesDetected = new Set();
  let detailedMetrics = [];

  const processFrame = async () => {
    if (videoElement.readyState < 2) return;

    let results;
    try {
      const startTimeMs = performance.now();
      results = poseLandmarker.detectForVideo(videoElement, startTimeMs);
    } catch (e) {
      console.warn("Frame processing error:", e);
      return;
    }

    frameCount++;

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      
      // Key landmark indices for posture analysis
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftEar = landmarks[7];
      const rightEar = landmarks[8];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      const nose = landmarks[0];

      // Calculate metrics
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      const headTilt = Math.abs(leftEar.y - rightEar.y);
      const hipDiff = Math.abs(leftHip.y - rightHip.y);
      
      // Check spine alignment (nose to hip midpoint)
      const hipMidX = (leftHip.x + rightHip.x) / 2;
      const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
      const spineAlignment = Math.abs(nose.x - shoulderMidX);

      let isGoodFrame = true;
      let frameIssues = [];

      // Thresholds for posture detection
      if (shoulderDiff > 0.05) {
        issuesDetected.add("Uneven Shoulders");
        frameIssues.push("Uneven Shoulders");
        isGoodFrame = false;
      }
      
      if (headTilt > 0.05) {
        issuesDetected.add("Head Tilt");
        frameIssues.push("Head Tilt");
        isGoodFrame = false;
      }

      if (hipDiff > 0.08) {
        issuesDetected.add("Uneven Hips");
        frameIssues.push("Uneven Hips");
        isGoodFrame = false;
      }

      if (spineAlignment > 0.15) {
        issuesDetected.add("Poor Spine Alignment");
        frameIssues.push("Poor Spine Alignment");
        isGoodFrame = false;
      }

      if (isGoodFrame) {
        goodPostureFrames++;
      }

      // Store detailed metrics for the latest frame
      detailedMetrics = {
        shoulderAlignment: (100 - (shoulderDiff * 1000)).toFixed(1),
        headPosition: (100 - (headTilt * 1000)).toFixed(1),
        hipAlignment: (100 - (hipDiff * 1000)).toFixed(1),
        spineAlignment: (100 - (Math.min(spineAlignment, 1) * 100)).toFixed(1)
      };
    }
  };

  return new Promise((resolve) => {
    const startAnalysis = () => {
        const intervalId = setInterval(() => {
            if(videoElement.paused || videoElement.ended) {
                clearInterval(intervalId);
                const score = frameCount > 0 ? Math.round((goodPostureFrames / frameCount) * 100) : 0;
                resolve({
                    postureScore: score,
                    postureIssues: Array.from(issuesDetected),
                    postureDetails: detailedMetrics,
                    framesAnalyzed: frameCount
                });
            } else {
                processFrame();
            }
        }, 100);
    };
    startAnalysis();
  });
}