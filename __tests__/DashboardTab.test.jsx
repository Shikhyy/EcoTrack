import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardTab from '../src/components/DashboardTab';

// Mock recharts because it uses ResizeObserver which is not present in JSDOM
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="recharts-container">{children}</div>,
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />
}));

// Mock react-use-measure to prevent ResizeObserver errors
jest.mock('react-use-measure', () => {
  return () => [() => {}, { width: 100, height: 100 }];
});

// Mock EarthGlobe because it uses @react-three/fiber which requires ResizeObserver
jest.mock('../src/components/nature/EarthGlobe', () => () => <div data-testid="earth-globe" />);

describe('DashboardTab Component', () => {
  const mockValues = {
    transport: 15,
    diet: 30,
    energy: 25,
    shopping: 10
  };

  it('renders the status correctly', () => {
    render(<DashboardTab values={mockValues} />);
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
  });

  it('renders the charts correctly', () => {
    render(<DashboardTab values={mockValues} />);
    expect(screen.getByTestId('recharts-container')).toBeInTheDocument();
  });

  it('renders quick facts based on footprint', () => {
    render(<DashboardTab values={mockValues} />);
    expect(screen.getByText(/Trees Needed\/Yr/i)).toBeInTheDocument();
    expect(screen.getByText(/Flight Equivalent/i)).toBeInTheDocument();
    expect(screen.getByText(/Vs Global Avg/i)).toBeInTheDocument();
  });
});
