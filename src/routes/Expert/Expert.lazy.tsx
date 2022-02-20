import React, { lazy, Suspense } from 'react';

const LazyExpert = lazy(() => import('./Expert'));

const Expert = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyExpert {...props} />
  </Suspense>
);

export default Expert;