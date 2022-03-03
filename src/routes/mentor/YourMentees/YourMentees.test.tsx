import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import YourMentees from './YourMentees';
import { BrowserRouter } from 'react-router-dom';

describe('<YourMentees />', () => {
  test('it should mount', () => {
    render(<BrowserRouter><YourMentees /></BrowserRouter>);
    
    const yourmentees = screen.getByTestId('YourMentees');

    expect(yourmentees).toBeInTheDocument();
  });
});