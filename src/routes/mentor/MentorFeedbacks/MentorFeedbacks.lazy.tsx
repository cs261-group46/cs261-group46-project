import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyMentorFeedbacks = lazy(() => import("./MentorFeedbacks"));

const MentorFeedbacks = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyMentorFeedbacks {...props} />
  </Suspense>
);

export default MentorFeedbacks;
