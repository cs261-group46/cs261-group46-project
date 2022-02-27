import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PieView from './PieView';

describe('<PieView />', () => {
  test('it should mount', () => {
    render(<PieView />);
    
    const pieView = screen.getByTestId('PieView');

    expect(pieView).toBeInTheDocument();
  });
});