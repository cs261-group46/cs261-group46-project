import React, { lazy, Suspense } from 'react';

const LazyUserEditDetials = lazy(() => import('./UserEditDetials'));

const UserEditDetials = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyUserEditDetials {...props} />
  </Suspense>
);

export default UserEditDetials;
