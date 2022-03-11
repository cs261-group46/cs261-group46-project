import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyMentorSignup = lazy(() => import("./MentorSignup"));

const MentorSignup = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyMentorSignup {...props} />
  </Suspense>
);

export default MentorSignup;
