import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazySetup = lazy(() => import("./Setup"));

const Setup = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazySetup {...props} />
  </Suspense>
);

export default Setup;
