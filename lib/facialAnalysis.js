// Suppress specific TF Lite info messages that are logged as errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) {
    return;
  }
  originalConsoleError(...args);
};

let faceLandmarker;
let runningMode = "VIDEO";

const BLENDSHAPES = {
  SMILE: ["mouthSmileLeft", "mouthSmileRight"],
  NERVOUS: ["browDownLeft", "browDownRight", "jawOpen"],
  ENGAGEMENT: ["eyeWideLeft", "eyeWideRight", "eyeLookUpLeft", "eyeLookUpRight"],
  CONFIDENCE: ["jawForward", "noseSneerLeft", "noseSneerRight"]
};

// Initialize the landmarker
async function createFaceLandmarker() {
  const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: true,
    runningMode,
    numFaces: 1
  });
  console.log("Face landmarker initialized successfully");
}

export async function analyzeFacialCues(videoElement) {
  if (!faceLandmarker) {
    console.log("Initializing face landmarker...");
    await createFaceLandmarker();
    if(!faceLandmarker) {
        console.error("FaceLandmarker not created after wait.");
        return {
          dominantEmotion: "neutral",
          eyeContact: "unknown",
          emotionScores: {},
          engagementLevel: 0
        };
    }
  }

  let happyScore = 0;
  let nervousScore = 0;
  let engagementScore = 0;
  let confidenceScore = 0;
  let eyeContactFrames = 0;
  let frameCount = 0;
  let faceDetectedFrames = 0;

  const processFrame = async () => {
    if (videoElement.readyState < 2) return;

    let results;
    try {
      const startTimeMs = performance.now();
      results = faceLandmarker.detectForVideo(videoElement, startTimeMs);
    } catch (e) {
      console.warn("Frame processing error:", e);
      return;
    }

    frameCount++;

    if (results.faceLandmarks && results.faceLandmarks.length > 0 && results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      faceDetectedFrames++;
      const blendshapes = results.faceBlendshapes[0].categories;
      const landmarks = results.faceLandmarks[0];
      
      // Calculate smile score
      const smile = blendshapes.filter(c => BLENDSHAPES.SMILE.includes(c.categoryName))
                               .reduce((acc, c) => acc + c.score, 0) / 2;
      
      // Calculate nervous score
      const nervous = blendshapes.filter(c => BLENDSHAPES.NERVOUS.includes(c.categoryName))
                                 .reduce((acc, c) => acc + c.score, 0) / 3;

      // Calculate engagement (eye opening)
      const engagement = blendshapes.filter(c => BLENDSHAPES.ENGAGEMENT.includes(c.categoryName))
                                   .reduce((acc, c) => acc + c.score, 0) / 4;

      // Calculate confidence indicators
      const confidence = blendshapes.filter(c => BLENDSHAPES.CONFIDENCE.includes(c.categoryName))
                                   .reduce((acc, c) => acc + c.score, 0) / 3;

      if(smile > 0.3) happyScore++;
      if(nervous > 0.2) nervousScore++;
      if(engagement > 0.4) engagementScore++;
      if(confidence > 0.3) confidenceScore++;

      // Simple eye contact detection (check if looking at camera)
      // Landmarks 33 and 133 are eye corners
      if (landmarks[33] && landmarks[133]) {
        const eyeAspect = Math.abs(landmarks[33].x - landmarks[133].x);
        if (eyeAspect > 0.05) { // Reasonable eye distance
          eyeContactFrames++;
        }
      }
    }
  };

  return new Promise((resolve) => {
    const startAnalysis = () => {
        const intervalId = setInterval(() => {
            if(videoElement.paused || videoElement.ended) {
                clearInterval(intervalId);

                let dominantEmotion = "neutral";
                let eyeContact = "poor";
                
                if (faceDetectedFrames > 0) {
                  const happyRatio = happyScore / faceDetectedFrames;
                  const nervousRatio = nervousScore / faceDetectedFrames;
                  const engagementRatio = engagementScore / faceDetectedFrames;
                  
                  if (happyRatio > 0.3) dominantEmotion = "happy";
                  else if (nervousRatio > 0.25) dominantEmotion = "nervous";
                  else if (engagementRatio > 0.4) dominantEmotion = "engaged";
                  
                  if (eyeContactFrames / faceDetectedFrames > 0.6) eyeContact = "good";
                  else if (eyeContactFrames / faceDetectedFrames > 0.3) eyeContact = "moderate";
                }

                resolve({
                    dominantEmotion,
                    eyeContact,
                    emotionScores: {
                      happiness: frameCount > 0 ? Math.round((happyScore / frameCount) * 100) : 0,
                      nervousness: frameCount > 0 ? Math.round((nervousScore / frameCount) * 100) : 0,
                      engagement: frameCount > 0 ? Math.round((engagementScore / frameCount) * 100) : 0,
                      confidence: frameCount > 0 ? Math.round((confidenceScore / frameCount) * 100) : 0
                    },
                    engagementLevel: frameCount > 0 ? Math.round((engagementScore / frameCount) * 100) : 0,
                    framesAnalyzed: frameCount,
                    faceDetectedFrames
                });
                return;
            }
            processFrame();
        }, 100); // process 10 frames per second
    };

    if (!videoElement.paused && !videoElement.ended && videoElement.currentTime > 0) {
        startAnalysis();
    } else {
        videoElement.onplay = startAnalysis;
        videoElement.play();
    }
  });
}
