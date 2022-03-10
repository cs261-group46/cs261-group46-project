import React, { lazy, Suspense } from 'react';

const LazyMenteeFeedbacks = lazy(() => import('./MenteeFeedbacks'));

const MenteeFeedbacks = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMenteeFeedbacks {...props} />
  </Suspense>
);

export default MenteeFeedbacks;
