import React, { lazy, Suspense } from 'react';

const LazySiteFeedback = lazy(() => import('./SiteFeedback'));

const SiteFeedback = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazySiteFeedback {...props} />
  </Suspense>
);

export default SiteFeedback;
