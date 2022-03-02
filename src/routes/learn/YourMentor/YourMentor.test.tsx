import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import YourMentor from './YourMentor';

describe('<YourMentor />', () => {
  test('it should mount', () => {
    render(<YourMentor />);
    
    const yourMentor = screen.getByTestId('YourMentor');

    expect(yourMentor).toBeInTheDocument();
  });
});