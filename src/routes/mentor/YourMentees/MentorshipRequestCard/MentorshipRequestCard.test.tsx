import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MentorshipRequestCard from './MentorshipRequestCard';

describe('<MentorshipRequestCard />', () => {
  test('it should mount', () => {
    render(<MentorshipRequestCard mentorshipRequest={{
      id: 0,
      mentee: {
        about: '',
        id: 0,
        topics: [],
        user: {
          department: {
            id: 0,
            name: ''
          },
          email: '',
          first_name: '',
          last_name: ''
        }
      }
    }} />);
    
    const mentorshipRequestCard = screen.getByTestId('MentorshipRequestCard');

    expect(mentorshipRequestCard).toBeInTheDocument();
  });
});