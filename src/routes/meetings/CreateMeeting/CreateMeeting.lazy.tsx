import React, { lazy, Suspense } from "react";

const LazyCreateMeeting = lazy(() => import("./CreateMeeting"));

const CreateMeeting = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyCreateMeeting {...props} />
  </Suspense>
);

export default CreateMeeting;
