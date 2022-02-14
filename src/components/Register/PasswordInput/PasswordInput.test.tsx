import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PasswordInput from './PasswordInput';
import useInput from "../../../hooks/UseInput/UseInput";

describe('<PasswordInput />', () => {
  test('it should mount', () => {
    const {
      enteredValue,
      isValueValid,
      changeHandler,
      blurHandler
    } = useInput(() => true);

    render(<PasswordInput value={enteredValue} isValid={isValueValid} onBlur={blurHandler} onChange={changeHandler}/>);
    
    const passwordInput = screen.getByTestId('PasswordInput');

    expect(passwordInput).toBeInTheDocument();
  });
});