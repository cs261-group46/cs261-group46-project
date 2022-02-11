import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Icon from './Icon';

describe('<Icon />', () => {
  test('it should mount', () => {
    render(<Icon />);
    
    const icon = screen.getByTestId('Icon');

    expect(icon).toBeInTheDocument();
  });
});