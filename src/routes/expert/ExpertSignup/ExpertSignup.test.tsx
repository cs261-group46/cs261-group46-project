import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExpertSignup from './ExpertSignup';

describe('<ExpertSignup />', () => {
  test('it should mount', () => {
    render(<ExpertSignup />);
    
    const expertSignup = screen.getByTestId('ExpertSignup');

    expect(expertSignup).toBeInTheDocument();
  });
});