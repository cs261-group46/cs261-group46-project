import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MeetingCreate from './MeetingCreate';

describe('<MeetingCreate />', () => {
  test('it should mount', () => {
    render(<MeetingCreate />);
    
    const meetingCreate = screen.getByTestId('MeetingCreate');

    expect(meetingCreate).toBeInTheDocument();
  });
});