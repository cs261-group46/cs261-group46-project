import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MentorSignup from './MentorSignup';
import { BrowserRouter } from 'react-router-dom';

describe('<MentorSignup />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><MentorSignup /></BrowserRouter>);
    
    const mentorSignup = screen.getByTestId('MentorSignup');

    expect(mentorSignup).toBeInTheDocument();
  });
});