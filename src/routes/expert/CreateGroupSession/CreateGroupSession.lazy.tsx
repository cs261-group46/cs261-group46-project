import React, { lazy, Suspense } from "react";

const LazyCreateGroupSession = lazy(() => import("./CreateGroupSession"));

const CreateGroupSession = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyCreateGroupSession {...props} />
  </Suspense>
);

export default CreateGroupSession;
