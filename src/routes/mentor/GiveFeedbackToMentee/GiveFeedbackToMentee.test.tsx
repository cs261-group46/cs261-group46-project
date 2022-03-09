import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GiveFeedbackToMentee from './GiveFeedbackToMentee';

describe('<GiveFeedbackToMentee />', () => {
  test('it should mount', () => {
    render(<GiveFeedbackToMentee />);
    
    const giveFeedbackToMentee = screen.getByTestId('GiveFeedbackToMentee');

    expect(giveFeedbackToMentee).toBeInTheDocument();
  });
});