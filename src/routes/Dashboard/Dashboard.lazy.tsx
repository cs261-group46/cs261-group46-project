import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyDashboard = lazy(() => import("./Dashboard"));

const Dashboard = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyDashboard {...props} />
  </Suspense>
);

export default Dashboard;
