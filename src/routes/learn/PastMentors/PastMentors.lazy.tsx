import React, { lazy, Suspense } from 'react';

const LazyPastMentors = lazy(() => import('./PastMentors'));

const PastMentors = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPastMentors {...props} />
  </Suspense>
);

export default PastMentors;
