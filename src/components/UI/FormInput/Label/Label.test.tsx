import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Label from './Label';

describe('<Label />', () => {
  test('it should mount', () => {
    render(<Label htmlFor={"nothing"}/>);

    const label = screen.getByTestId('Label');

    expect(label).toBeInTheDocument();
  });
});