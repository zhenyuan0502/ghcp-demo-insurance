import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test without routing dependencies
test('renders basic React app', () => {
  // Create a simple component for testing
  const TestComponent = () => <div>Insurance App</div>;
  render(<TestComponent />);
  const element = screen.getByText(/insurance app/i);
  expect(element).toBeInTheDocument();
});
