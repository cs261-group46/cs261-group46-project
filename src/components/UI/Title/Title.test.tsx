import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Title from './Title';

describe('<Title />', () => {
  test('it should mount', () => {
    render(<Title text={"test"}/>);
    
    const title = screen.getByTestId('Title');

    expect(title).toBeInTheDocument();
  });

  test('it should contain the text', () => {
    const testValue = "testing value"

    render(<Title text={testValue}/>);

    const title = screen.getByTestId('Title');

    expect(title).toContainHTML(testValue)
  });
});