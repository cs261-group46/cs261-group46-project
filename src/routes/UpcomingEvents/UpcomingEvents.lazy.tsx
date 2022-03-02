import React, { lazy, Suspense } from 'react';
import { EventProps } from './Event/Event.d';

const LazyUpcomingEvents = lazy(() => import('./UpcomingEvents'));

const UpcomingEvents = (
  props: JSX.IntrinsicAttributes & {
    events: EventProps[];
    children?: React.ReactNode;
  }
) => (
  <Suspense fallback={null}>
    <LazyUpcomingEvents {...props} />
  </Suspense>
);

export default UpcomingEvents;
