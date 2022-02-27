import React, { FC } from 'react';
import styles from './PieView.module.scss';

interface PieViewProps {}

const PieView: FC<PieViewProps> = () => (
  <div className={styles.PieView} data-testid="PieView">
    PieView Component
  </div>
);

export default PieView;
