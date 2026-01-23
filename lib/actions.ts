'use server';

import dbConnect from '@/lib/mongodb';
import Analysis from '@/models/Analysis'

export async function generateAiFeedback(data: any, type: "speech" | "emotion" | "posture" | "comprehensive" = "speech") {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("GROQ_API_KEY is missing in environment variables");
    return null;
  }

  let systemPrompt = "";
  
  if (type === "comprehensive") {
    systemPrompt = `You are a world-class communication coach. Analyze the user's combined performance data from Speech, Facial Emotion, and Posture analysis.
    
    Output strictly valid JSON with this schema:
    {
      "summary": "string (2-3 sentences summary of performance)",
      "strengths": ["string", "string", "string"],
      "improvements": ["string", "string", "string"],
      "overallScore": number (0-100)
    }
    Keep the tone professional, constructive, and encouraging.`;
  } else if (type === "posture") {
    systemPrompt = `You are an expert body language coach. Analyze the user's posture data (score, issues like head tilt or uneven shoulders) and provide feedback on their physical presence.
    
    Output strictly valid JSON with this schema:
    {
      "feedback": ["string", "string"],
      "recommendations": ["string", "string"],
      "overallScore": number (0-100)
    }
    Keep the tone encouraging but professional.`;
  } else if (type === "emotion") {
    systemPrompt = `You are an expert non-verbal communication coach. Analyze the user's facial expression data (dominant emotion, eye contact, etc.) and provide feedback on their stage presence.
    
    Output strictly valid JSON with this schema:
    {
      "feedback": ["string", "string"],
      "recommendations": ["string", "string"],
      "overallScore": number (0-100)
    }
    Keep the tone encouraging but professional.`;
  } else {
    systemPrompt = `You are an expert communication coach. Analyze the user's session data (facial expressions, speech metrics) and provide constructive feedback.
            
    Output strictly valid JSON with this schema:
    {
      "feedback": ["string", "string"],
      "recommendations": ["string", "string"],
      "overallScore": number (0-100)
    }
    Keep the tone encouraging but professional.`;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: JSON.stringify(data)
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const json = await response.json();
    const content = json.choices[0]?.message?.content;
    if (content) {
      // Clean up potential markdown code blocks before parsing
      const cleaned = content.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      return JSON.parse(cleaned);
    }
    return null;
  } catch (error) {
    console.error("AI Feedback Error:", error);
    return null;
  }
}

export async function saveAnalysisResult(userId: string, type: string, data: any) {
  try {
    await dbConnect();
    const analysis = new Analysis({
      userId: userId || 'anonymous',
      type,
      data,
    });
    await analysis.save();
    return { success: true };
  } catch (error) {
    console.error("Error saving analysis:", error);
    return { success: false, error: "Failed to save analysis" };
  }
}