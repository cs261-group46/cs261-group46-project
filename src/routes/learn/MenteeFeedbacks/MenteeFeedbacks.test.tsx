import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenteeFeedbacks from './MenteeFeedbacks';

describe('<MenteeFeedbacks />', () => {
  test('it should mount', () => {
    render(<MenteeFeedbacks />);
    
    const menteeFeedbacks = screen.getByTestId('MenteeFeedbacks');

    expect(menteeFeedbacks).toBeInTheDocument();
  });
});