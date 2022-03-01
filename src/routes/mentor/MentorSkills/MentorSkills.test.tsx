import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MentorSkills from './MentorSkills';

describe('<MentorSkills />', () => {
  test('it should mount', () => {
    render(<MentorSkills />);
    
    const mentorSkills = screen.getByTestId('MentorSkills');

    expect(mentorSkills).toBeInTheDocument();
  });
});