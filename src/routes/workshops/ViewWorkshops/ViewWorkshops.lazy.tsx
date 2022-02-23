import React, { lazy, Suspense } from 'react';

const LazyViewWorkshops = lazy(() => import('./ViewWorkshops'));

const ViewWorkshops = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyViewWorkshops {...props} />
  </Suspense>
);

export default ViewWorkshops;
