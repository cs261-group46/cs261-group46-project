import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlansOfAction from './PlansOfAction';

describe('<PlansOfAction />', () => {
  test('it should mount', () => {
    render(<PlansOfAction milestones={['Testing']} />);

    const plansOfAction = screen.getByTestId('PlansOfAction');

    expect(plansOfAction).toBeInTheDocument();
  });
});
