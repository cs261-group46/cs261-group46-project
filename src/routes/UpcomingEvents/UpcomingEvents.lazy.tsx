import React, { lazy, Suspense } from "react";

const LazyUpcomingEvents = lazy(() => import("./UpcomingEvents"));

const UpcomingEvents = (
  props: JSX.IntrinsicAttributes & {
    children?: React.ReactNode;
  }
) => (
  <Suspense fallback={null}>
    <LazyUpcomingEvents {...props} />
  </Suspense>
);

export default UpcomingEvents;
