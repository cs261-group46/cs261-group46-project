import React, { lazy, Suspense } from 'react';

const LazyYourMentor = lazy(() => import('./YourMentor'));

const YourMentor = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyYourMentor {...props} />
  </Suspense>
);

export default YourMentor;
