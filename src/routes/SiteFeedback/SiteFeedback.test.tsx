import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SiteFeedback from './SiteFeedback';

describe('<SiteFeedback />', () => {
  test('it should mount', () => {
    render(<SiteFeedback />);
    
    const siteFeedback = screen.getByTestId('SiteFeedback');

    expect(siteFeedback).toBeInTheDocument();
  });
});