import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatePicker from './DatePicker';

describe('<DatePicker />', () => {
  test('it should mount', () => {
    render(<DatePicker onChange={() => {}} value={new Date()}/>);
    
    const datePicker = screen.getByTestId('DatePicker');

    expect(datePicker).toBeInTheDocument();
  });
});