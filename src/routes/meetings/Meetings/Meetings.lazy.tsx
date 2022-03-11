import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyMeetings = lazy(() => import("./Meetings"));

const Meetings = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyMeetings {...props} />
  </Suspense>
);

export default Meetings;
