import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Homepage from './Homepage';
import {BrowserRouter} from "react-router-dom";

describe('<Homepage />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><Homepage /></BrowserRouter>);
    
    const homepage = screen.getByTestId('Homepage');

    expect(homepage).toBeInTheDocument();
  });
});