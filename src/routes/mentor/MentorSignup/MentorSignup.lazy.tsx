import React, { lazy, Suspense } from 'react';

const LazyMentorSignup = lazy(() => import('./MentorSignup'));

const MentorSignup = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMentorSignup {...props} />
  </Suspense>
);

export default MentorSignup;
