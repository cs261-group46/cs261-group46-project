import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyMentorSkills = lazy(() => import("./MentorSkills"));

const MentorSkills = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyMentorSkills {...props} />
  </Suspense>
);

export default MentorSkills;
