import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyComponentPlaygound = lazy(() => import("./ComponentPlaygound"));

const ComponentPlaygound = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponentPlaygound {...props} />
  </Suspense>
);

export default ComponentPlaygound;
