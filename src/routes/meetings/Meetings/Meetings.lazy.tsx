import React, { lazy, Suspense } from 'react';

const LazyMeetings = lazy(() => import('./Meetings'));

const Meetings = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMeetings {...props} />
  </Suspense>
);

export default Meetings;
