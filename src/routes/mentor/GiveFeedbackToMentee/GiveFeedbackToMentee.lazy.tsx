import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyGiveFeedbackToMentee = lazy(() => import("./GiveFeedbackToMentee"));

const GiveFeedbackToMentee = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyGiveFeedbackToMentee {...props} />
  </Suspense>
);

export default GiveFeedbackToMentee;
