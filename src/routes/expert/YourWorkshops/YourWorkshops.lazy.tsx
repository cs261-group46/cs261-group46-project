import React, { lazy, Suspense } from 'react';

const LazyYourWorkshops = lazy(() => import('./YourWorkshops'));

const YourWorkshops = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyYourWorkshops {...props} />
  </Suspense>
);

export default YourWorkshops;
