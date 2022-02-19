import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Setup from './Setup';

describe('<Setup />', () => {
  test('it should mount', () => {
    render(<Setup />);
    
    const setup = screen.getByTestId('Setup');

    expect(setup).toBeInTheDocument();
  });
});