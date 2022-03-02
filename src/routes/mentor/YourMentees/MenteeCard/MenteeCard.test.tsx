import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenteeCard from './MenteeCard';
import { BrowserRouter } from 'react-router-dom';

describe('<MenteeCard />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><MenteeCard firstname='John' lastname='Smith' id={1} completedGoal={4} totalGoal={10}/></BrowserRouter>);
    
    const menteecard = screen.getByTestId('MenteeCard');

    expect(menteecard).toBeInTheDocument();
  });
});