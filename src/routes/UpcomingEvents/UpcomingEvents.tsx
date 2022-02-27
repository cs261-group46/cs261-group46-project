import React, { FC } from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import styles from './UpcomingEvents.module.scss';
import Title from '../../components/UI/Title/Title';
import Event from './Event/Event';
import { EventProps } from './Event/Event.d';

interface UpcomingEventsProps {
  events: EventProps[];
}

const UpcomingEvents: FC<UpcomingEventsProps> = props => {
  return (
    <MainLayout title={'Upcoming Events'}>
      {props.events.map((event_props, index) => {
        return <Event event={event_props} />;
      })}

      <div data-testid='UpcomingEvents' />
    </MainLayout>
  );
};

export default UpcomingEvents;
