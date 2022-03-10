import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PastMentors from './PastMentors';

describe('<PastMentors />', () => {
  test('it should mount', () => {
    render(<PastMentors />);
    
    const pastMentors = screen.getByTestId('PastMentors');

    expect(pastMentors).toBeInTheDocument();
  });
});