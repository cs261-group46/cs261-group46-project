import React, { lazy, Suspense } from 'react';

const LazyExpertExpertises = lazy(() => import('./ExpertExpertises'));

const ExpertExpertises = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyExpertExpertises {...props} />
  </Suspense>
);

export default ExpertExpertises;
