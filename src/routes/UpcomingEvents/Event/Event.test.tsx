import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Event from './Event';
import { EventProps } from './Event.d';

describe('<UpcomingEvents/Event />', () => {
  test('it should mount', () => {
    render(<Event event={{} as EventProps} />);

    const UpcomingEventsEvent = screen.getByTestId('UpcomingEvents/Event');

    expect(UpcomingEventsEvent).toBeInTheDocument();
  });
});
