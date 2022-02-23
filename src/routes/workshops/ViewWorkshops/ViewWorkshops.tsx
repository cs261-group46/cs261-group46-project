import React, { FC } from 'react';
import styles from './ViewWorkshops.module.scss';

interface ViewWorkshopsProps {}

const ViewWorkshops: FC<ViewWorkshopsProps> = () => (
  <div className={styles.ViewWorkshops} data-testid="ViewWorkshops">
    ViewWorkshops Component
  </div>
);

export default ViewWorkshops;
