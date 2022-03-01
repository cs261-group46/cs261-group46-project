import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExpertExpertises from './ExpertExpertises';

describe('<ExpertExpertises />', () => {
  test('it should mount', () => {
    render(<ExpertExpertises />);
    
    const expertExpertises = screen.getByTestId('ExpertExpertises');

    expect(expertExpertises).toBeInTheDocument();
  });
});