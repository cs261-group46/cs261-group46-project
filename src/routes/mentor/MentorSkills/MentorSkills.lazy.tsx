import React, { lazy, Suspense } from 'react';

const LazyMentorSkills = lazy(() => import('./MentorSkills'));

const MentorSkills = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMentorSkills {...props} />
  </Suspense>
);

export default MentorSkills;
