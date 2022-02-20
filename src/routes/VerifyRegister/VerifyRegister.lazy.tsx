import React, { lazy, Suspense } from 'react';

const LazyVerifyRegister = lazy(() => import('./VerifyRegister'));

const VerifyRegister = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyVerifyRegister {...props} />
  </Suspense>
);

export default VerifyRegister;