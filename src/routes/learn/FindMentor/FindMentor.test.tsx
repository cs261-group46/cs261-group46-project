import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import FindMentor from "./FindMentor";

describe('<FindMentor />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><FindMentor /></BrowserRouter>);
    
    const menteeSignup = screen.getByTestId('FindMentor');

    expect(menteeSignup).toBeInTheDocument();
  });
});