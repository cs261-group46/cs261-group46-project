import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import YourProfile from './YourProfile';

describe('<YourProfile />', () => {
  test('it should mount', () => {
    render(<YourProfile />);
    
    const yourProfile = screen.getByTestId('YourProfile');

    expect(yourProfile).toBeInTheDocument();
  });
});