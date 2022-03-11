import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyYourInterests = lazy(() => import("./Interests"));

const YourInterests = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyYourInterests {...props} />
  </Suspense>
);

export default YourInterests;
