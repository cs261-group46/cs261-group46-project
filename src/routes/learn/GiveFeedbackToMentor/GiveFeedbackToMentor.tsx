import React, { FC } from 'react';
import styles from './GiveFeedbackToMentor.module.scss';

interface GiveFeedbackToMentorProps {}

const GiveFeedbackToMentor: FC<GiveFeedbackToMentorProps> = () => (
  <div className={styles.GiveFeedbackToMentor} data-testid="GiveFeedbackToMentor">
    GiveFeedbackToMentor Component
  </div>
);

export default GiveFeedbackToMentor;
