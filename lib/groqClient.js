// Groq AI Client for enhanced analysis
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeSpeechWithAI(transcript, wpm, fillerWords, duration) {
  try {
    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Analyze this speech performance and provide professional feedback:
          
Transcript: "${transcript}"
Words Per Minute: ${wpm}
Filler Words Count: ${fillerWords}
Duration: ${duration} seconds

Provide a brief analysis covering:
1. Speech Quality (clarity, pace, confidence)
2. Areas of Strength (what they did well)
3. Areas for Improvement (specific suggestions)
4. Overall Communication Score (1-10)

Format response as JSON with keys: quality, strengths, improvements, score`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return {
        quality: responseText.substring(0, 200),
        strengths: [`WPM: ${wpm}`, `Managed ${fillerWords} filler words`],
        improvements: ["Continue practicing for more fluency"],
        score: wpm > 150 ? 7 : wpm > 100 ? 6 : 5
      };
    }
  } catch (error) {
    console.error("Groq speech analysis error:", error);
    return null;
  }
}

export async function analyzeEmotionWithAI(dominantEmotion, eyeContact, postureScore) {
  try {
    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Analyze the emotional presentation based on:
          
Dominant Emotion: ${dominantEmotion}
Eye Contact: ${eyeContact}
Posture Score: ${postureScore}%

Provide professional feedback on:
1. Emotional Authenticity
2. Confidence Level (1-10)
3. Engagement Quality
4. Recommendations for emotional improvement

Format as JSON with keys: authenticity, confidence, engagement, recommendations`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return {
        authenticity: dominantEmotion === "happy" ? "High" : "Moderate",
        confidence: eyeContact === "good" ? 8 : 6,
        engagement: "Professional",
        recommendations: ["Maintain eye contact", "Show more enthusiasm"]
      };
    }
  } catch (error) {
    console.error("Groq emotion analysis error:", error);
    return null;
  }
}

export async function analyzePostureWithAI(postureScore, postureIssues) {
  try {
    const issuesText = postureIssues.length > 0 ? postureIssues.join(", ") : "No major issues";
    
    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Analyze body language and posture based on:
          
Posture Score: ${postureScore}%
Detected Issues: ${issuesText}

Provide professional feedback on:
1. Overall Body Language Quality
2. Professional Presence (1-10)
3. Specific Posture Corrections
4. Impact on Communication

Format as JSON with keys: quality, presence, corrections, impact`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return {
        quality: postureScore > 70 ? "Excellent" : postureScore > 50 ? "Good" : "Needs Improvement",
        presence: postureScore > 70 ? 8 : 6,
        corrections: postureIssues.length > 0 ? postureIssues : ["Great posture!"],
        impact: "Strong professional presence"
      };
    }
  } catch (error) {
    console.error("Groq posture analysis error:", error);
    return null;
  }
}

export async function generateAIFeedback(analysisData) {
  try {
    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Generate comprehensive professional feedback based on this communication analysis:

Speech Analysis: WPM ${analysisData.wpm}, Filler Words: ${analysisData.fillerWords}
Emotional Presentation: ${analysisData.dominantEmotion}
Posture Quality: ${analysisData.postureScore || 0}%
Eye Contact: ${analysisData.eyeContact}
Confidence Level: ${analysisData.confidenceScore}/10

Please provide:
1. Overall Communication Assessment (2-3 sentences)
2. Key Strengths (3 points - what they did well)
3. Areas for Improvement (3 points - specific, actionable)
4. Action Plan (3 concrete steps for next practice)

Format as JSON with keys: assessment, feedback (array), recommendations (array), actionPlan (array)`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return {
        assessment: "Good communication performance overall. Focus on consistency and confidence.",
        feedback: [
          `Speech pace was ${analysisData.wpm} WPM`,
          `Demonstrated ${analysisData.dominantEmotion} emotion`,
          `Maintained ${analysisData.eyeContact} eye contact`
        ],
        recommendations: [
          "Practice speaking more slowly for clarity",
          "Record yourself to identify filler words",
          "Work on maintaining consistent posture"
        ],
        actionPlan: [
          "Record 2-3 more practice sessions this week",
          "Focus on one area at a time",
          "Review feedback before next practice"
        ]
      };
    }
  } catch (error) {
    console.error("Groq feedback generation error:", error);
    return null;
  }
}
