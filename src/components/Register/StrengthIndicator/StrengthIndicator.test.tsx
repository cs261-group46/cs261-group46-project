import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StrengthIndicator from './StrengthIndicator';

describe('<StrengthIndicator />', () => {
  test('it should mount', () => {
    render(<StrengthIndicator password={"abcdefg"}/>);

    const strengthIndicator = screen.getByTestId('StrengthIndicator');

    expect(strengthIndicator).toBeInTheDocument();
  });
});