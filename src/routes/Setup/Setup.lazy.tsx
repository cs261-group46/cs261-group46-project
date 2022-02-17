import React, { lazy, Suspense } from 'react';

const LazySetup = lazy(() => import('./Setup'));

const Setup = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazySetup {...props} />
  </Suspense>
);

export default Setup;
