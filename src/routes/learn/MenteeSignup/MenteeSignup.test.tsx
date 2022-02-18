import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenteeSignup from './MenteeSignup';

describe('<MenteeSignup />', () => {
  test('it should mount', () => {
    render(<MenteeSignup />);
    
    const menteeSignup = screen.getByTestId('MenteeSignup');

    expect(menteeSignup).toBeInTheDocument();
  });
});