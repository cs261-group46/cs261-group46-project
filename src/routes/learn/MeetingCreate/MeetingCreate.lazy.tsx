import React, { lazy, Suspense } from 'react';

const LazyMeetingCreate = lazy(() => import('./MeetingCreate'));

const MeetingCreate = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMeetingCreate {...props} />
  </Suspense>
);

export default MeetingCreate;
