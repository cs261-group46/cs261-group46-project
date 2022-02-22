import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BigTextInput from './BigTextInput';

describe('<BigTextInput />', () => {
  test('it should mount', () => {
    render(
      <BigTextInput
        id={'profile'}
        label={'Write a short profile about yourself, viewable by Mentors'}
        placeholder={'I can play Electric Guitar'}
        value=''
        isValid={true}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const bigTextInput = screen.getByTestId('BigTextInput');

    expect(bigTextInput).toBeInTheDocument();
  });
});
