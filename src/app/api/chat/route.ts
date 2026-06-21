import { NextResponse } from 'next/server';

// Input validation constants
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_LENGTH = 20;
const MAX_NUMERIC_VALUE = 1000;
const MIN_NUMERIC_VALUE = 0;

/**
 * Sanitizes and clamps a numeric value to a safe range.
 */
function sanitizeNumber(value: unknown, fallback: number = 0): number {
  const num = Number(value);
  if (!isFinite(num) || isNaN(num)) return fallback;
  return Math.max(MIN_NUMERIC_VALUE, Math.min(MAX_NUMERIC_VALUE, num));
}

/**
 * Sanitizes a string value to prevent injection.
 */
function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLength).replace(/[<>]/g, '');
}

function buildSystemPrompt(context: Record<string, unknown>) {
  const challengesMap: Record<number, string> = {
    1: 'Meatless Week',
    2: 'Zero Waste Weekend',
    3: 'Public Transit Commute',
  };

  const accepted = Array.isArray(context.acceptedChallenges)
    ? (context.acceptedChallenges as number[]).filter((id) => [1, 2, 3].includes(id))
    : [];

  const acceptedNames = accepted.map((id) => challengesMap[id]).filter(Boolean);
  const challengeText =
    acceptedNames.length > 0
      ? `\n  Accepted Challenges: ${acceptedNames.join(', ')} (Encourage them about these!)`
      : `\n  Accepted Challenges: None yet (Suggest they check the Social Good tab!)`;

  return `You are EcoGuide, an enthusiastic AI assistant for a carbon footprint tracking app.
User profile:
  Monthly CO2: ${sanitizeNumber(context.totalScore)} kg
  Transport: ${sanitizeNumber(context.transport)} kg
  Energy: ${sanitizeNumber(context.energy)} kg
  Food: ${sanitizeNumber(context.food)} kg${challengeText}

Give practical, specific, encouraging advice in under 90 words.
Use emojis. Focus on their highest-impact areas. Be warm and motivating.`;
}

export async function POST(req: Request) {
  try {
    // Enforce request size limit
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10_000) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { context, history, userMessage } = body;

    // Validate userMessage
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }
    const sanitizedMessage = sanitizeString(userMessage, MAX_MESSAGE_LENGTH);
    if (!sanitizedMessage.trim()) {
      return NextResponse.json({ error: 'userMessage cannot be empty' }, { status: 400 });
    }

    // Validate and sanitize context
    const safeContext: Record<string, unknown> = {
      totalScore: sanitizeNumber((context as Record<string, unknown>)?.totalScore),
      transport: sanitizeNumber((context as Record<string, unknown>)?.transport),
      energy: sanitizeNumber((context as Record<string, unknown>)?.energy),
      food: sanitizeNumber((context as Record<string, unknown>)?.food),
      acceptedChallenges: (context as Record<string, unknown>)?.acceptedChallenges,
    };

    // Validate history
    const safeHistory = Array.isArray(history)
      ? history
          .slice(-MAX_HISTORY_LENGTH)
          .filter(
            (m) =>
              m &&
              typeof m === 'object' &&
              ['user', 'assistant'].includes(m.role) &&
              typeof m.content === 'string'
          )
          .map((m) => ({ role: m.role, content: sanitizeString(m.content, MAX_MESSAGE_LENGTH) }))
      : [];

    const systemPrompt = buildSystemPrompt(safeContext);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('Missing GROQ_API_KEY on the server.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...safeHistory,
      { role: 'user', content: sanitizedMessage },
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 200,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq API Error:', err);
      return NextResponse.json({ error: 'Failed to communicate with AI provider' }, { status: 502 });
    }

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
