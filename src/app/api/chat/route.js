import { NextResponse } from 'next/server';

function buildSystemPrompt(context) {
  const challengesMap = {
    1: "Meatless Week",
    2: "Zero Waste Weekend",
    3: "Public Transit Commute"
  };
  
  const acceptedNames = context.acceptedChallenges?.map(id => challengesMap[id]) || [];
  const challengeText = acceptedNames.length > 0 
    ? `\n  Accepted Challenges: ${acceptedNames.join(', ')} (Encourage them about these!)`
    : `\n  Accepted Challenges: None yet (Suggest they check the Social Good tab!)`;

  return `You are EcoGuide, an enthusiastic AI assistant for a carbon footprint tracking app.
User profile:
  Monthly CO2: ${context.totalScore} kg
  Transport: ${context.transport} kg
  Energy: ${context.energy} kg
  Food: ${context.food} kg${challengeText}

Give practical, specific, encouraging advice in under 90 words.
Use emojis. Focus on their highest-impact areas. Be warm and motivating.`;
}

export async function POST(req) {
  try {
    const { context, history, userMessage } = await req.json();
    const systemPrompt = buildSystemPrompt(context);
    
    // Use the secure server-side environment variable
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("Missing GROQ_API_KEY on the server.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: userMessage }
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq API Error:", err);
      return NextResponse.json({ error: "Failed to communicate with AI provider" }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
