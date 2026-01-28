import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { postureScore, postureIssues } = await request.json();
    const issuesText = Array.isArray(postureIssues) ? postureIssues.join(', ') : 'No major issues';

    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Analyze body language and posture:

Posture Score: ${postureScore}%
Issues Detected: ${issuesText}

Provide analysis in JSON format with:
- quality: Overall body language quality
- presence: Professional presence score 1-10
- corrections: Array of specific posture corrections
- impact: Communication impact assessment

Return ONLY valid JSON.`
        }
      ]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const analysis = JSON.parse(text);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Posture AI analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
