import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazySiteFeedback = lazy(() => import("./SiteFeedback"));

const SiteFeedback = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazySiteFeedback {...props} />
  </Suspense>
);

export default SiteFeedback;
