import dbConnect from "./lib/mongodb";
import Analysis from "./models/Analysis";

async function insertDemoData() {
  await dbConnect();
  const userId = "69760c17f8229f9744b8039e";
  const now = new Date();

  const analysisData = [
    {
      userId,
      type: "speech",
      data: {
        wpm: 120,
        fillerWords: 3,
        tone: "confident"
      },
      createdAt: now
    },
    {
      userId,
      type: "emotion",
      data: {
        dominantEmotion: "happy",
        eyeContact: "excellent"
      },
      createdAt: now
    },
    {
      userId,
      type: "posture",
      data: {
        postureScore: 85,
        postureIssues: ["slouching"]
      },
      createdAt: now
    }
  ];

  await Analysis.insertMany(analysisData);
  console.log("Demo data inserted for user:", userId);
  process.exit(0);
}

insertDemoData().catch((err) => {
  console.error(err);
  process.exit(1);
});
