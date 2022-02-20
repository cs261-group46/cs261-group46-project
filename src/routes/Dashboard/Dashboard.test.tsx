import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';

describe('<Dashboard />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><Dashboard /></BrowserRouter>);
    
    const dashboard = screen.getByTestId('Dashboard');

    expect(dashboard).toBeInTheDocument();
  });
});