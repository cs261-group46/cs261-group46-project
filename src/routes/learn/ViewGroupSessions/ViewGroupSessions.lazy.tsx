import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyViewWorkshops = lazy(() => import("./ViewGroupSessions"));

const ViewWorkshops = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyViewWorkshops {...props} />
  </Suspense>
);

export default ViewWorkshops;
