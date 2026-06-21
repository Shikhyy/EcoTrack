/**
 * @jest-environment node
 */
import { POST } from '../../src/app/api/chat/route';
import { NextResponse } from 'next/server';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      body,
      json: async () => body,
    })),
  },
}));

// Mock global fetch
global.fetch = jest.fn();

const VALID_BODY = {
  context: { totalScore: 200, transport: 100, energy: 60, food: 40, acceptedChallenges: [1] },
  history: [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hi!' }],
  userMessage: 'How can I reduce my footprint?',
};

function makeRequest(body, headers = {}) {
  return {
    headers: new Map(Object.entries({ 'content-length': JSON.stringify(body).length.toString(), ...headers })),
    json: async () => body,
  };
}

describe('POST /api/chat', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv, GROQ_API_KEY: 'test-key-123' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 500 when GROQ_API_KEY is missing', async () => {
    delete process.env.GROQ_API_KEY;
    const req = makeRequest(VALID_BODY);
    await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  });

  it('returns 400 when userMessage is missing', async () => {
    const req = makeRequest({ ...VALID_BODY, userMessage: undefined });
    await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'userMessage is required' },
      { status: 400 }
    );
  });

  it('returns 400 when userMessage is empty string', async () => {
    const req = makeRequest({ ...VALID_BODY, userMessage: '   ' });
    await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'userMessage cannot be empty' },
      { status: 400 }
    );
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = {
      headers: new Map([['content-length', '10']]),
      json: async () => { throw new SyntaxError('Unexpected token'); },
    };
    await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  });

  it('returns 502 when Groq API fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Rate limit exceeded',
    });
    const req = makeRequest(VALID_BODY);
    await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to communicate with AI provider' },
      { status: 502 }
    );
  });

  it('returns 200 with reply on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Try cycling more! 🚲' } }],
      }),
    });
    const req = makeRequest(VALID_BODY);
    await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith({ reply: 'Try cycling more! 🚲' });
  });

  it('sanitizes over-length messages to MAX_MESSAGE_LENGTH', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
    });
    const longMessage = 'a'.repeat(1000);
    const req = makeRequest({ ...VALID_BODY, userMessage: longMessage });
    await POST(req);
    // The call should succeed (not 400) since message is trimmed, not rejected
    const [, init] = NextResponse.json.mock.calls[0];
    expect(init?.status ?? 200).toBe(200);
  });

  it('sanitizes numeric context values by clamping to 0-1000', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
    });
    const req = makeRequest({
      ...VALID_BODY,
      context: { totalScore: -999, transport: 9999, energy: 'NaN', food: null },
    });
    await POST(req);
    // Should complete successfully with clamped values
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    const systemMsg = callBody.messages[0].content;
    expect(systemMsg).toContain('Monthly CO2: 0 kg'); // clamped from -999
    expect(systemMsg).toContain('Transport: 1000 kg'); // clamped from 9999
  });
});
