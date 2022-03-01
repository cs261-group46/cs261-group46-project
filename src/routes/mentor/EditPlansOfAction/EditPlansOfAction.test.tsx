import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditPlansOfAction from './EditPlansOfAction';

describe('<EditPlansOfAction />', () => {
  test('it should mount', () => {
    render(<EditPlansOfAction />);
    
    const editPlansOfAction = screen.getByTestId('EditPlansOfAction');

    expect(editPlansOfAction).toBeInTheDocument();
  });
});