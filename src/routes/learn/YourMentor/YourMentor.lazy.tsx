import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyYourMentor = lazy(() => import("./YourMentor"));

const YourMentor = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyYourMentor {...props} />
  </Suspense>
);

export default YourMentor;
