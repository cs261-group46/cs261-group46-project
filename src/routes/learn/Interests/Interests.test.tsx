import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import YourInterests from './Interests';

describe('<YourInterests />', () => {
  test('it should mount', () => {
    render(<YourInterests />);
    
    const yourInterests = screen.getByTestId('YourInterests');

    expect(yourInterests).toBeInTheDocument();
  });
});