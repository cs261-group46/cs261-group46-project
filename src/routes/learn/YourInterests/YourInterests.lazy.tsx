import React, { lazy, Suspense } from 'react';

const LazyYourInterests = lazy(() => import('./YourInterests'));

const YourInterests = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyYourInterests {...props} />
  </Suspense>
);

export default YourInterests;
