import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyYourWorkshops = lazy(() => import("./YourGroupSessions"));

const YourWorkshops = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyYourWorkshops {...props} />
  </Suspense>
);

export default YourWorkshops;
