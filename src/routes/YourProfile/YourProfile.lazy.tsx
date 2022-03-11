import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyYourProfile = lazy(() => import("./YourProfile"));

const YourProfile = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyYourProfile {...props} />
  </Suspense>
);

export default YourProfile;
