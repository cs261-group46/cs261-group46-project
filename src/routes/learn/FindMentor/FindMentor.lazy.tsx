import React, { lazy, Suspense } from "react";

const LazyMenteeSignup = lazy(() => import("./FindMentor"));

const MenteeSignup = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyMenteeSignup {...props} />
  </Suspense>
);

export default MenteeSignup;
