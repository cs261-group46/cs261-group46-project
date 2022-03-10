import React, { lazy, Suspense } from 'react';

const LazyGiveFeedbackForMeeting = lazy(() => import('./GiveFeedbackForMeeting'));

const GiveFeedbackForMeeting = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyGiveFeedbackForMeeting {...props} />
  </Suspense>
);

export default GiveFeedbackForMeeting;
