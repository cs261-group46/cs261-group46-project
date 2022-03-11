import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyCreateGroupSession = lazy(() => import("./CreateGroupSession"));

const CreateGroupSession = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyCreateGroupSession {...props} />
  </Suspense>
);

export default CreateGroupSession;
