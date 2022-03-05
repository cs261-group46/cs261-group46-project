import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from './Profile';
import { BrowserRouter } from 'react-router-dom';

describe('<Profile />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><Profile /></BrowserRouter>);
    
    const profile = screen.getByTestId('Profile');

    expect(profile).toBeInTheDocument();
  });
});