import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DraggableSelectedOptions from './DraggableSelectedOptions';

describe('<DraggableSelectedOptions />', () => {
  test('it should mount', () => {
    render(<DraggableSelectedOptions selected={[]} onRemoveSelected={() => {}} onSetSelected={() => {}}/>);
    
    const selectedOptions = screen.getByTestId('DraggableSelectedOptions');

    expect(selectedOptions).toBeInTheDocument();
  });
});