import {
  FaceLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.js";

let faceLandmarker;
let runningMode = "VIDEO";

const BLENDSHAPES = {
  SMILE: ["mouthSmileLeft", "mouthSmileRight"],
  NERVOUS: ["browDownLeft", "browDownRight", "jawOpen"],
};

// Initialize the landmarker
async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 1
  });
  console.log("Face landmarker created");
}

createFaceLandmarker();

export async function analyzeFacialCues(videoElement) {
  if (!faceLandmarker) {
    console.log("Waiting for landmarker to be created");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait and retry
    if(!faceLandmarker) {
        console.error("FaceLandmarker not created after wait.");
        return null;
    }
  }

  let happyScore = 0;
  let nervousScore = 0;
  let frameCount = 0;

  const processFrame = async () => {
    const startTimeMs = performance.now();
    const results = faceLandmarker.detectForVideo(videoElement, startTimeMs);
    frameCount++;

    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;
      
      const smile = blendshapes.filter(c => BLENDSHAPES.SMILE.includes(c.categoryName))
                               .reduce((acc, c) => acc + c.score, 0) / 2;
      
      const nervous = blendshapes.filter(c => BLENDSHAPES.NERVOUS.includes(c.categoryName))
                                 .reduce((acc, c) => acc + c.score, 0) / 3;

      if(smile > 0.3) happyScore++;
      if(nervous > 0.2) nervousScore++;
    }
  }

  return new Promise((resolve) => {
    videoElement.onplay = () => {
        const intervalId = setInterval(() => {
            if(videoElement.paused || videoElement.ended) {
                clearInterval(intervalId);

                let dominantEmotion = "neutral";
                if(happyScore / frameCount > 0.2) dominantEmotion = "happy";
                else if (nervousScore / frameCount > 0.15) dominantEmotion = "nervous";
                
                // Placeholder for eye contact
                const eyeContact = "good"; 

                resolve({
                    dominantEmotion,
                    eyeContact
                });
                return;
            }
            processFrame();
        }, 100); // process 10 frames per second
    };
    videoElement.play();
  });
}
