import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MentorSkills from './MentorSkills';
import {BrowserRouter} from "react-router-dom";

describe('<MentorSkills />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><MentorSkills /></BrowserRouter>);
    
    const mentorSkills = screen.getByTestId('MentorSkills');

    expect(mentorSkills).toBeInTheDocument();
  });
});