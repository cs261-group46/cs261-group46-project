import React, { lazy, Suspense } from "react";

const LazyMeetingFeedback = lazy(() => import("./MeetingFeedback"));

const MeetingFeedback = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyMeetingFeedback {...props} />
  </Suspense>
);

export default MeetingFeedback;
