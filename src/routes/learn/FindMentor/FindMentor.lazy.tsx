import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyMenteeSignup = lazy(() => import("./FindMentor"));

const MenteeSignup = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyMenteeSignup {...props} />
  </Suspense>
);

export default MenteeSignup;
