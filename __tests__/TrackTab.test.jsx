import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrackTab from '../src/components/TrackTab';

describe('TrackTab Component', () => {
  const mockValues = {
    transport: 50,
    diet: 50,
    energy: 50,
    shopping: 50
  };
  
  const mockSetValues = jest.fn();

  it('renders all sliders', () => {
    render(<TrackTab values={mockValues} setValues={mockSetValues} />);
    
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Diet')).toBeInTheDocument();
    expect(screen.getByText('Home Energy')).toBeInTheDocument();
    expect(screen.getByText('Shopping')).toBeInTheDocument();
  });

  it('allows interaction with sliders', () => {
    render(<TrackTab values={mockValues} setValues={mockSetValues} />);
    
    // Get all sliders (range inputs)
    const sliders = screen.getAllByRole('slider');
    // Change the first one (transport)
    fireEvent.change(sliders[0], { target: { value: 75 } });
    
    // setValues is called with a callback function `prev => ...`
    expect(mockSetValues).toHaveBeenCalledWith(expect.any(Function));
    
    // Test the callback behavior
    const updateFn = mockSetValues.mock.calls[0][0];
    const newState = updateFn(mockValues);
    expect(newState.transport).toBe(75);
  });
});
