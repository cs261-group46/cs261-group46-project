import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HoursInput from "./HoursInput";

describe('<24HourInput />', () => {
  test('it should mount', () => {
    render(<HoursInput />);
    
    const hoursInput = screen.getByTestId('24HourInput');

    expect(hoursInput).toBeInTheDocument();
  });
});