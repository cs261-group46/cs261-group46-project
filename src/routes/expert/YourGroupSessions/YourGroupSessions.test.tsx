import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import YourWorkshops from './YourGroupSessions';

describe('<YourWorkshops />', () => {
  test('it should mount', () => {
    render(<YourWorkshops />);
    
    const yourWorkshops = screen.getByTestId('YourWorkshops');

    expect(yourWorkshops).toBeInTheDocument();
  });
});