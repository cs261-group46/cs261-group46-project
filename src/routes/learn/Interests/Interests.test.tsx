import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Interests from './Interests';
import {BrowserRouter} from "react-router-dom";

describe('<YourInterests />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><Interests /></BrowserRouter>);
    
    const yourInterests = screen.getByTestId('Interests');

    expect(yourInterests).toBeInTheDocument();
  });
});