import React, { lazy, Suspense } from 'react';

const LazyCreateWorkshop = lazy(() => import('./CreateWorkshop'));

const CreateWorkshop = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCreateWorkshop {...props} />
  </Suspense>
);

export default CreateWorkshop;
