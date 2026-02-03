import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { transcript, wpm, fillerWords, duration } = await request.json();

    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Analyze this speech performance:
          
Transcript: "${transcript}"
Words Per Minute: ${wpm}
Filler Words: ${fillerWords}
Duration: ${duration} seconds

Provide analysis in JSON format with:
- quality: Speech quality assessment
- strengths: Array of 3 strengths
- improvements: Array of 3 improvements
- score: Overall score 1-10

Return ONLY valid JSON.`
        }
      ]
    });

    const content = completion?.choices?.[0]?.message?.content ?? "{}";
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      const match = content.match(/\{[\s\S]*\}/);
      analysis = match ? JSON.parse(match[0]) : { error: "Invalid AI response" };
    }
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Speech AI analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
