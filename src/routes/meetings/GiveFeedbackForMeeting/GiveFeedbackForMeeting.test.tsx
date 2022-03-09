import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GiveFeedbackForMeeting from './GiveFeedbackForMeeting';

describe('<GiveFeedbackForMeeting />', () => {
  test('it should mount', () => {
    render(<GiveFeedbackForMeeting />);
    
    const giveFeedbackForMeeting = screen.getByTestId('GiveFeedbackForMeeting');

    expect(giveFeedbackForMeeting).toBeInTheDocument();
  });
});