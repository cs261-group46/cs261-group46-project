import React, { lazy, Suspense } from 'react';

const LazyGiveFeedbackToMentee = lazy(() => import('./GiveFeedbackToMentee'));

const GiveFeedbackToMentee = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyGiveFeedbackToMentee {...props} />
  </Suspense>
);

export default GiveFeedbackToMentee;
