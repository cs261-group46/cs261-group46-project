import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PasswordInput from './PasswordInput';

describe('<PasswordInput />', () => {
  test('it should mount', () => {
    render(<PasswordInput value={"value"} onChange={() => {}} onBlur={() => {}} isValid={true}/>);
    
    const passwordInput = screen.getByTestId('PasswordInput');

    expect(passwordInput).toBeInTheDocument();
  });
});