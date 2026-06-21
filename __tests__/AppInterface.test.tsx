import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppInterface from '../src/components/AppInterface';

// Mock the child components to isolate testing for AppInterface
jest.mock('../src/components/TrackTab', () => () => <div data-testid="track-tab" />);
jest.mock('../src/components/DashboardTab', () => () => <div data-testid="dashboard-tab" />);
jest.mock('../src/components/CommunityTab', () => () => <div data-testid="community-tab" />);
jest.mock('../src/components/ai/AIAssistant', () => () => <div data-testid="ai-assistant" />);

describe('AppInterface Component', () => {
  it('renders the navigation and default tab', () => {
    render(<AppInterface />);
    
    // Check navigation buttons exist
    expect(screen.getByText('1. Track')).toBeInTheDocument();
    expect(screen.getByText('2. Insights')).toBeInTheDocument();
    expect(screen.getByText('3. Social Good')).toBeInTheDocument();
    expect(screen.getByText('4. EcoGuide AI')).toBeInTheDocument();
    
    // Check default tab is TrackTab
    expect(screen.getByTestId('track-tab')).toBeInTheDocument();
  });

  it('switches tabs on click', () => {
    render(<AppInterface />);
    
    // Switch to Dashboard
    fireEvent.click(screen.getByText('2. Insights'));
    expect(screen.getByTestId('dashboard-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('track-tab')).not.toBeInTheDocument();

    // Switch to Community
    fireEvent.click(screen.getByText('3. Social Good'));
    expect(screen.getByTestId('community-tab')).toBeInTheDocument();
    
    // Switch to AI
    fireEvent.click(screen.getByText('4. EcoGuide AI'));
    expect(screen.getByTestId('ai-assistant')).toBeInTheDocument();
  });
});
