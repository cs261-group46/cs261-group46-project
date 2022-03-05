import React, { lazy, Suspense } from 'react';

const LazyYourProfile = lazy(() => import('./YourProfile'));

const YourProfile = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyYourProfile {...props} />
  </Suspense>
);

export default YourProfile;
