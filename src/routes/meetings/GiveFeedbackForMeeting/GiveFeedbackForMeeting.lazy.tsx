import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyGiveFeedbackForMeeting = lazy(
  () => import("./GiveFeedbackForMeeting")
);

const GiveFeedbackForMeeting = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyGiveFeedbackForMeeting {...props} />
  </Suspense>
);

export default GiveFeedbackForMeeting;
