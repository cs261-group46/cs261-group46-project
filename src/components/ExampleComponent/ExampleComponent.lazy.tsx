import React, { lazy, Suspense } from 'react';

const LazyExampleComponent = lazy(() => import('./ExampleComponent'));

const ExampleComponent = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyExampleComponent {...props} />
  </Suspense>
);

export default ExampleComponent;
