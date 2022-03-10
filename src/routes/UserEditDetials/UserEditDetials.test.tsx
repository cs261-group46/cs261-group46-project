import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEditDetials from './UserEditDetials';

describe('<UserEditDetials />', () => {
  test('it should mount', () => {
    render(<UserEditDetials />);
    
    const userEditDetials = screen.getByTestId('UserEditDetials');

    expect(userEditDetials).toBeInTheDocument();
  });
});