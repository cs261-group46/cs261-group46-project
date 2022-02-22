import React, { FC } from 'react';
import styles from './HoursInput.module.scss';

interface HoursInputProps {}

const HoursInput: FC<HoursInputProps> = () => (
  <div className={styles.HoursInput} data-testid="24HourInput">
    24HourInput Component
  </div>
);

export default HoursInput;
