const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialskill';

const analysisSchema = new mongoose.Schema({
  userId: String,
  type: String,
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.models.Analysis || mongoose.model('Analysis', analysisSchema);

async function insertDemoData() {
  await mongoose.connect(MONGODB_URI);
  const userId = '69760c17f8229f9744b8039e';
  const now = new Date();

  const analysisData = [
    {
      userId,
      type: 'speech',
      data: {
        wpm: 120,
        fillerWords: 3,
        tone: 'confident',
      },
      createdAt: now,
    },
    {
      userId,
      type: 'emotion',
      data: {
        dominantEmotion: 'happy',
        eyeContact: 'excellent',
      },
      createdAt: now,
    },
    {
      userId,
      type: 'posture',
      data: {
        postureScore: 85,
        postureIssues: ['slouching'],
      },
      createdAt: now,
    },
  ];

  await Analysis.insertMany(analysisData);
  console.log('Demo data inserted for user:', userId);
  process.exit(0);
}

insertDemoData().catch((err) => {
  console.error(err);
  process.exit(1);
});
