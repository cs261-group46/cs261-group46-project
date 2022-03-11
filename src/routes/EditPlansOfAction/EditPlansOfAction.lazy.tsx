import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyEditPlansOfAction = lazy(() => import("./EditPlansOfAction"));

const EditPlansOfAction = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyEditPlansOfAction {...props} />
  </Suspense>
);

export default EditPlansOfAction;
