import React, { lazy, Suspense } from 'react';

const LazyPlansOfAction = lazy(() => import('./PlansOfAction'));

const PlansOfAction = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPlansOfAction {...props} />
  </Suspense>
);

export default PlansOfAction;
