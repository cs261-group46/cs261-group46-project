import React, { lazy, Suspense } from 'react';

const LazyComponentPlaygound = lazy(() => import('./ComponentPlaygound'));

const ComponentPlaygound = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyComponentPlaygound {...props} />
  </Suspense>
);

export default ComponentPlaygound;
