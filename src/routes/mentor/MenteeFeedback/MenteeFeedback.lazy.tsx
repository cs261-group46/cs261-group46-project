import React, { lazy, Suspense } from "react";

const LazyMenteeFeedback = lazy(() => import("./MenteeFeedback"));

const MenteeFeedback = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyMenteeFeedback {...props} />
  </Suspense>
);

export default MenteeFeedback;
