import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GiveFeedbackToMentor from './GiveFeedbackToMentor';

describe('<GiveFeedbackToMentor />', () => {
  test('it should mount', () => {
    render(<GiveFeedbackToMentor />);
    
    const giveFeedbackToMentor = screen.getByTestId('GiveFeedbackToMentor');

    expect(giveFeedbackToMentor).toBeInTheDocument();
  });
});