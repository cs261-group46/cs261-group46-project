import React, { lazy, Suspense } from 'react';

const LazyGiveFeedbackToMentor = lazy(() => import('./GiveFeedbackToMentor'));

const GiveFeedbackToMentor = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyGiveFeedbackToMentor {...props} />
  </Suspense>
);

export default GiveFeedbackToMentor;
