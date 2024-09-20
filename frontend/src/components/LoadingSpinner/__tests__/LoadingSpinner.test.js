import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../';

describe('LoadingSpinner Component', () => {
  it('should render the loading spinner with correct accessibility attributes', () => {
    render(<LoadingSpinner />);

    // Check if the spinner with role="status" is rendered
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();

    // Verify that the aria-label for accessibility is set to "Loading"
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
