import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HoursInput from "./HoursInput";

describe('<24HourInput />', () => {
  test('it should mount', () => {
    let value: boolean[] = []
    const setValue = (newValue: boolean[]) => { value = newValue }

    render(<HoursInput label={"test"} value={value} onChange={setValue} onBlur={() => {}} isValid={true}/>);
    
    const hoursInput = screen.getByTestId('HoursInput');

    expect(hoursInput).toBeInTheDocument();
  });
});