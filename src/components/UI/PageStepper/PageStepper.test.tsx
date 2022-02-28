import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageStepper from './PageStepper';

describe('<PageStepper />', () => {
  test('it should mount', () => {
    render(<PageStepper page={0} setPage={() => {}} maxPages={1}/>);
    
    const pageStepper = screen.getByTestId('PageStepper');

    expect(pageStepper).toBeInTheDocument();
  });
});