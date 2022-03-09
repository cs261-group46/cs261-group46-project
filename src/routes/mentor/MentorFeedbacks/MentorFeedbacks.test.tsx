import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MentorFeedbacks from './MentorFeedbacks';

describe('<MentorFeedbacks />', () => {
  test('it should mount', () => {
    render(<MentorFeedbacks />);
    
    const mentorFeedbacks = screen.getByTestId('MentorFeedbacks');

    expect(mentorFeedbacks).toBeInTheDocument();
  });
});