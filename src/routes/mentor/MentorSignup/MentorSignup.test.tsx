import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MentorSignup from './MentorSignup';

describe('<MentorSignup />', () => {
  test('it should mount', () => {
    render(<MentorSignup />);
    
    const mentorSignup = screen.getByTestId('MentorSignup');

    expect(mentorSignup).toBeInTheDocument();
  });
});