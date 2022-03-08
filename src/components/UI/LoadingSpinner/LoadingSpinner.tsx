import React, { FC } from "react";
import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {}

const LoadingSpinner: FC<LoadingSpinnerProps> = () => (
  <div className={styles.LoadingSpinner} data-testid="LoadingSpinner">
    LoadingSpinner Component
  </div>
);

export default LoadingSpinner;
