import React, { lazy, Suspense } from "react";

const LazyMentorFeedback = lazy(() => import("./MentorFeedback"));

const MentorFeedback = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyMentorFeedback {...props} />
  </Suspense>
);

export default MentorFeedback;
