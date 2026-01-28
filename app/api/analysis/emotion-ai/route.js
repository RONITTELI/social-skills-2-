import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { dominantEmotion, eyeContact, postureScore } = await request.json();

    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Analyze emotional presentation:

Dominant Emotion: ${dominantEmotion}
Eye Contact: ${eyeContact}
Posture Score: ${postureScore}%

Provide analysis in JSON format with:
- authenticity: Emotional authenticity level
- confidence: Confidence score 1-10
- engagement: Engagement quality assessment
- recommendations: Array of improvement suggestions

Return ONLY valid JSON.`
        }
      ]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const analysis = JSON.parse(text);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Emotion AI analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
