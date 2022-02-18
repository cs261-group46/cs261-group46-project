import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenteeSignup from './MenteeSignup';
import { BrowserRouter } from 'react-router-dom';

describe('<MenteeSignup />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><MenteeSignup /></BrowserRouter>);
    
    const menteeSignup = screen.getByTestId('MenteeSignup');

    expect(menteeSignup).toBeInTheDocument();
  });
});