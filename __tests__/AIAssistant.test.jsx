import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the agent module
jest.mock('../src/lib/agent', () => ({
  askEcoGuide: jest.fn(),
}));

import { askEcoGuide } from '../src/lib/agent';
import AIAssistant from '../src/components/ai/AIAssistant';

// JSDOM doesn't implement scrollIntoView — mock it globally
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

const DEFAULT_PROPS = {
  values: { transport: 120, diet: 80, energy: 90, shopping: 50 },
  score: 340,
  acceptedChallenges: [1],
};

describe('AIAssistant Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the welcome message with the score', () => {
    render(<AIAssistant {...DEFAULT_PROPS} />);
    expect(screen.getByText(/Based on your footprint of 340 kg CO₂/i)).toBeInTheDocument();
  });

  it('renders the EcoGuide AI heading', () => {
    render(<AIAssistant {...DEFAULT_PROPS} />);
    expect(screen.getByRole('heading', { name: /EcoGuide AI/i })).toBeInTheDocument();
  });

  it('renders the input field', () => {
    render(<AIAssistant {...DEFAULT_PROPS} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the send button', () => {
    render(<AIAssistant {...DEFAULT_PROPS} />);
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('sends a message and displays the AI response', async () => {
    askEcoGuide.mockResolvedValueOnce('Great question! Try cycling more 🚲');

    render(<AIAssistant {...DEFAULT_PROPS} />);

    const input = screen.getByRole('textbox');
    const sendBtn = screen.getByRole('button', { name: /send/i });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'How do I reduce transport?' } });
      fireEvent.click(sendBtn);
    });

    expect(askEcoGuide).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText('Great question! Try cycling more 🚲')).toBeInTheDocument();
    });
  });

  it('clears the input after sending a message', async () => {
    askEcoGuide.mockResolvedValueOnce('Good job!');

    render(<AIAssistant {...DEFAULT_PROPS} />);

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));
    });

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('displays an error message when askEcoGuide throws', async () => {
    askEcoGuide.mockRejectedValueOnce(new Error('Network error'));

    render(<AIAssistant {...DEFAULT_PROPS} />);

    await act(async () => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Help!' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('does not send an empty message', async () => {
    render(<AIAssistant {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(askEcoGuide).not.toHaveBeenCalled();
  });

  it('sends message on Enter key press', async () => {
    askEcoGuide.mockResolvedValueOnce('Sure!');
    render(<AIAssistant {...DEFAULT_PROPS} />);

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hello AI' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    await waitFor(() => {
      expect(askEcoGuide).toHaveBeenCalledTimes(1);
    });
  });
});
