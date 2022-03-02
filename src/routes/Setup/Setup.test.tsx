import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Setup from './Setup';
import {BrowserRouter} from "react-router-dom";

describe('<Setup />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><Setup /></BrowserRouter>);
    
    const setup = screen.getByTestId('Setup');

    expect(setup).toBeInTheDocument();
  });
});