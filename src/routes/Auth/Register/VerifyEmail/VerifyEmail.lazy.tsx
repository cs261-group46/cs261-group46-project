import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyVerifyEmail = lazy(() => import("./VerifyEmail"));

const VerifyEmail = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyVerifyEmail {...props} />
  </Suspense>
);

export default VerifyEmail;
