import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock tipsEngine
jest.mock('../src/lib/tipsEngine', () => ({
  getPersonalizedTips: jest.fn(),
}));

// Mock TipCard
jest.mock('../src/components/tips/TipCard', () => ({ icon, title, desc, impact }) => (
  <div data-testid="tip-card">
    <span data-testid="tip-title">{title}</span>
    <span data-testid="tip-desc">{desc}</span>
    <span data-testid="tip-impact">{impact}</span>
  </div>
));

import { getPersonalizedTips } from '../src/lib/tipsEngine';
import ActionsTab from '../src/components/ActionsTab';

const MOCK_TIPS = [
  { key: 'public_transit', icon: '🚇', title: 'Take public transit', desc: 'Saves 60kg CO₂/month', impact: 'High', color: 'green' },
  { key: 'led_switch', icon: '💡', title: 'Switch to LEDs', desc: 'Saves 15kg CO₂ monthly', impact: 'Medium', color: 'gold' },
  { key: 'thermostat', icon: '🌡️', title: 'Lower your thermostat', desc: 'Saves 5% heating energy', impact: 'Medium', color: 'sky' },
];

describe('ActionsTab Component', () => {
  const DEFAULT_PROPS = {
    values: { transport: 200, diet: 80, energy: 90, shopping: 50 },
    score: 420,
  };

  beforeEach(() => {
    getPersonalizedTips.mockReturnValue(MOCK_TIPS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Action Plan heading', () => {
    render(<ActionsTab {...DEFAULT_PROPS} />);
    expect(screen.getByRole('heading', { name: /Action Plan/i })).toBeInTheDocument();
  });

  it('renders all tips returned by getPersonalizedTips', () => {
    render(<ActionsTab {...DEFAULT_PROPS} />);
    const tipCards = screen.getAllByTestId('tip-card');
    expect(tipCards).toHaveLength(3);
  });

  it('displays tip titles correctly', () => {
    render(<ActionsTab {...DEFAULT_PROPS} />);
    expect(screen.getByText('Take public transit')).toBeInTheDocument();
    expect(screen.getByText('Switch to LEDs')).toBeInTheDocument();
    expect(screen.getByText('Lower your thermostat')).toBeInTheDocument();
  });

  it('calls getPersonalizedTips with the provided values', () => {
    render(<ActionsTab {...DEFAULT_PROPS} />);
    expect(getPersonalizedTips).toHaveBeenCalledWith(DEFAULT_PROPS.values, DEFAULT_PROPS.score);
  });

  it('renders empty state when no tips are returned', () => {
    getPersonalizedTips.mockReturnValue([]);
    render(<ActionsTab {...DEFAULT_PROPS} />);
    expect(screen.queryAllByTestId('tip-card')).toHaveLength(0);
  });

  it('renders the subtitle text', () => {
    render(<ActionsTab {...DEFAULT_PROPS} />);
    expect(screen.getByText(/Personalized steps based on your highest impact areas/i)).toBeInTheDocument();
  });

  it('displays impact level for each tip', () => {
    render(<ActionsTab {...DEFAULT_PROPS} />);
    expect(screen.getAllByTestId('tip-impact')[0]).toHaveTextContent('High');
  });
});
