import React, { lazy, Suspense } from 'react';

const LazyExpertSignup = lazy(() => import('./ExpertSignup'));

const ExpertSignup = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyExpertSignup {...props} />
  </Suspense>
);

export default ExpertSignup;
