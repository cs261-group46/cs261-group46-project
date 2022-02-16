import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectedOptions from './SelectedOptions';

describe('<SelectedOptions />', () => {
  test('it should mount', () => {
    render(<SelectedOptions />);
    
    const selectedOptions = screen.getByTestId('SelectedOptions');

    expect(selectedOptions).toBeInTheDocument();
  });
});