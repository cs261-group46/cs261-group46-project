import React, { FC } from 'react';
import styles from './SiteFeedback.module.scss';

interface SiteFeedbackProps {}

const SiteFeedback: FC<SiteFeedbackProps> = () => (
  <div className={styles.SiteFeedback} data-testid="SiteFeedback">
    SiteFeedback Component
  </div>
);

export default SiteFeedback;
