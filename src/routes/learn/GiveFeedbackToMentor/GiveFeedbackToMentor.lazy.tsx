import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyGiveFeedbackToMentor = lazy(() => import("./GiveFeedbackToMentor"));

const GiveFeedbackToMentor = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyGiveFeedbackToMentor {...props} />
  </Suspense>
);

export default GiveFeedbackToMentor;
