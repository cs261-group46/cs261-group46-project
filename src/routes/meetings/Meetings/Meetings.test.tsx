import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Meetings from './Meetings';

describe('<Meetings />', () => {
  test('it should mount', () => {
    render(<Meetings />);
    
    const meetings = screen.getByTestId('Meetings');

    expect(meetings).toBeInTheDocument();
  });
});