/**
 * @jest-environment node
 */
import { GET } from '../../src/app/api/community/route';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      body,
      json: async () => body,
    })),
  },
}));

global.fetch = jest.fn();

const VALID_COMMUNITY_DATA = {
  globalGoal: {
    title: 'Plant 10,000 Trees',
    description: 'Help reforest the Amazon.',
    targetKg: 100000,
    currentKg: 78450,
  },
  challenges: [
    { id: 1, title: 'Meatless Week', impact: 'Saves 15kg CO2', joined: 342, goal: 1000 },
    { id: 2, title: 'Zero Waste Weekend', impact: 'Saves 5kg CO2', joined: 210, goal: 500 },
    { id: 3, title: 'Public Transit Commute', impact: 'Saves 20kg CO2', joined: 890, goal: 2000 },
  ],
  localInitiatives: [
    { title: 'Community Garden', distance: '1.2 mi', description: 'Grow local food.' },
    { title: 'Park Cleanup', distance: '0.5 mi', description: 'Clean local parks.' },
  ],
};

describe('GET /api/community', () => {
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
    await GET();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  });

  it('returns 502 when Groq API fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Service unavailable',
    });
    await GET();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to fetch from Groq API' },
      { status: 502 }
    );
  });

  it('returns 500 when AI returns empty content', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: null } }] }),
    });
    await GET();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  });

  it('returns 500 when AI returns invalid JSON', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'not valid json at all' } }] }),
    });
    await GET();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  });

  it('returns 500 when AI returns JSON with wrong schema (missing challenges)', async () => {
    const badData = { globalGoal: VALID_COMMUNITY_DATA.globalGoal, localInitiatives: [] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(badData) } }] }),
    });
    await GET();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  });

  it('returns 200 with validated community data on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify(VALID_COMMUNITY_DATA) } }],
      }),
    });
    await GET();
    expect(NextResponse.json).toHaveBeenCalledWith(VALID_COMMUNITY_DATA);
  });
});
