import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContentCards from './ContentCards';

describe('<ContentCards />', () => {
  test('it should mount', () => {
    render(<ContentCards />);
    
    const contentCards = screen.getByTestId('ContentCards');

    expect(contentCards).toBeInTheDocument();
  });
});