import React, { lazy, Suspense } from 'react';

const LazyVerifyEmail = lazy(() => import('./VerifyEmail'));

const VerifyEmail = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyVerifyEmail {...props} />
  </Suspense>
);

export default VerifyEmail;