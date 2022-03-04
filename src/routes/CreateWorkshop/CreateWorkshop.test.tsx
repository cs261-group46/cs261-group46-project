import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateWorkshop from './CreateWorkshop';

describe('<CreateWorkshop />', () => {
  test('it should mount', () => {
    render(<CreateWorkshop />);
    
    const createWorkshop = screen.getByTestId('CreateWorkshop');

    expect(createWorkshop).toBeInTheDocument();
  });
});