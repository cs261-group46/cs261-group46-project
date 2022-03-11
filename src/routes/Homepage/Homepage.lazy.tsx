import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyHomepage = lazy(() => import("./Homepage"));

const Homepage = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyHomepage {...props} />
  </Suspense>
);

export default Homepage;
