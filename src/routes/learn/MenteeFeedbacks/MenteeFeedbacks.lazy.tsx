import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyMenteeFeedbacks = lazy(() => import("./MenteeFeedbacks"));

const MenteeFeedbacks = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyMenteeFeedbacks {...props} />
  </Suspense>
);

export default MenteeFeedbacks;
