import React, { lazy, Suspense } from 'react';

const LazyEditPlansOfAction = lazy(() => import('./EditPlansOfAction'));

const EditPlansOfAction = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyEditPlansOfAction {...props} />
  </Suspense>
);

export default EditPlansOfAction;
