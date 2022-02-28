import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewWorkshops from './ViewWorkshops';

describe('<ViewWorkshops />', () => {
  test('it should mount', () => {
    render(<ViewWorkshops />);
    
    const viewWorkshops = screen.getByTestId('ViewWorkshops');

    expect(viewWorkshops).toBeInTheDocument();
  });
});