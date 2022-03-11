import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

const LazyCreateMeeting = lazy(() => import("./CreateMeeting"));

const CreateMeeting = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyCreateMeeting {...props} />
  </Suspense>
);

export default CreateMeeting;
