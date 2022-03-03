import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExpertExpertises from './ExpertExpertises';
import {BrowserRouter} from "react-router-dom";

describe('<ExpertExpertises />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><ExpertExpertises /></BrowserRouter>);
    
    const expertExpertises = screen.getByTestId('ExpertExpertises');

    expect(expertExpertises).toBeInTheDocument();
  });
});