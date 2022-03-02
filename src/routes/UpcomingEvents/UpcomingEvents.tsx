import React, { FC, useState } from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import styles from './UpcomingEvents.module.scss';
// import Title from '../../components/UI/Title/Title';
import Event from './Event/Event';
import Button from '../../components/UI/Button/Button';
import { EventProps } from './Event/Event.d';
import UseVerifyAuth from '../../hooks/UseVerifyAuth/UseVerifyAuth';

interface UpcomingEventsProps {
  events: EventProps[];
}

const UpcomingEvents: FC<UpcomingEventsProps> = props => {
  // UseVerifyAuth();
  const [filterEvents, setFilterEvents] = useState<number>(0);

  return (
    <MainLayout title={'Upcoming Events'}>
      <div className={styles.buttonDiv}>
        <Button
          className={styles.firstButton}
          onClick={() => {
            setFilterEvents(0);
          }}
          buttonStyle={(filterEvents === 0 && 'primary') || undefined}
        >
          All
        </Button>
        <Button
          className={styles.middleButton}
          onClick={() => {
            setFilterEvents(1);
          }}
          buttonStyle={(filterEvents === 1 && 'primary') || undefined}
        >
          Your Learning
        </Button>
        <Button
          className={styles.lastButton}
          onClick={() => {
            setFilterEvents(2);
          }}
          buttonStyle={(filterEvents === 2 && 'primary') || undefined}
        >
          Your Mentoring
        </Button>
      </div>

      <div className={styles.container}>
        {props.events.map((event_props, index) => {
          return <Event event={event_props} key={index} />;
        })}
      </div>

      <div data-testid='UpcomingEvents' />
    </MainLayout>
  );
};

export default UpcomingEvents;
