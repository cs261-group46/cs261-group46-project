import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyExpertExpertises = lazy(() => import("./ExpertExpertises"));

const ExpertExpertises = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyExpertExpertises {...props} />
  </Suspense>
);

export default ExpertExpertises;
