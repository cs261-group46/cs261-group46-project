import React, { FC } from 'react';
import styles from './YourWorkshops.module.scss';

interface YourWorkshopsProps {}

const YourWorkshops: FC<YourWorkshopsProps> = () => (
  <div className={styles.YourWorkshops} data-testid="YourWorkshops">
    YourWorkshops Component
  </div>
);

export default YourWorkshops;
