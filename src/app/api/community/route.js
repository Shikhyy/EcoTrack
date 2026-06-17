import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a data generation API for an eco-tracking application.
Your job is to generate realistic, inspiring community challenges and local environmental initiatives.
Return ONLY valid JSON with no markdown formatting, no backticks, and no explanations.

Schema:
{
  "globalGoal": {
    "title": "string (e.g. 'Fund a Solar Well in Kenya')",
    "description": "string",
    "targetKg": number (e.g. 100000),
    "currentKg": number (e.g. 78450)
  },
  "challenges": [
    {
      "id": number (1, 2, 3),
      "title": "string",
      "impact": "string (e.g. 'Saves 15kg CO2')",
      "joined": number,
      "goal": number
    }
  ],
  "localInitiatives": [
    {
      "title": "string",
      "distance": "string (e.g. '2.4 mi')",
      "description": "string"
    }
  ]
}

Ensure you generate exactly 3 challenges and 2 local initiatives. Make them realistic and varied.`;

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: "Generate fresh community data in JSON." }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!res.ok) {
      console.error("Groq API Error:", await res.text());
      return NextResponse.json({ error: "Failed to fetch from Groq API" }, { status: 502 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
        throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(text);
    return NextResponse.json(parsedData);
    
  } catch (error) {
    console.error("Community API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
