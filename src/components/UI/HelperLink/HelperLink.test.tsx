import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HelperLink from './HelperLink';

describe('<HelperLink />', () => {
  test('it should mount', () => {
    render(<HelperLink description={''} linkText={''} />);
    
    const helperLink = screen.getByTestId('HelperLink');

    expect(helperLink).toBeInTheDocument();
  });
});