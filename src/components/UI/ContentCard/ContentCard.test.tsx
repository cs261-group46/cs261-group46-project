import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContentCard from './ContentCard';

describe('<ContentCard />', () => {
  test('it should mount', () => {
    render(<ContentCard heading={''} sections={[]} />);
    
    const contentCard = screen.getByTestId('ContentCard');

    expect(contentCard).toBeInTheDocument();
  });
});