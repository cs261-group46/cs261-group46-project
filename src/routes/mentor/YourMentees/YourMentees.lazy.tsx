import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyYourMentees = lazy(() => import("./YourMentees"));

const YourMentees = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyYourMentees {...props} />
  </Suspense>
);

export default YourMentees;
