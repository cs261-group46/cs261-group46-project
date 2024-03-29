import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyPastMentors = lazy(() => import("./PastMentors"));

const PastMentors = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyPastMentors {...props} />
  </Suspense>
);

export default PastMentors;
