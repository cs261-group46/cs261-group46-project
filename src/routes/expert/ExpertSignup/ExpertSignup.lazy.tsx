import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyExpertSignup = lazy(() => import("./ExpertSignup"));

const ExpertSignup = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyExpertSignup {...props} />
  </Suspense>
);

export default ExpertSignup;
