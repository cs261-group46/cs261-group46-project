import React, { lazy, Suspense } from 'react';

const LazyMentorFeedbacks = lazy(() => import('./MentorFeedbacks'));

const MentorFeedbacks = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMentorFeedbacks {...props} />
  </Suspense>
);

export default MentorFeedbacks;
