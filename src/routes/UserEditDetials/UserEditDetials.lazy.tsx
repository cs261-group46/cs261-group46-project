import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyUserEditDetials = lazy(() => import("./UserEditDetials"));

const UserEditDetials = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyUserEditDetials {...props} />
  </Suspense>
);

export default UserEditDetials;
