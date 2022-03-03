import React, { FC } from "react";
import styles from "./BarChart.module.scss";

interface BarChartProp {
  completedGoals: number;
  totalGoals: number;
  className?: string;
}

const BarChart: FC<BarChartProp> = (props) => {
  const percentageDone = (props.completedGoals / props.totalGoals) * 100;

  return (
    <div className={`${styles.Container} ${props.className ?? ""}`}>
      <p>Completed Goals - {percentageDone.toFixed(2)}% </p>
      <div
        className={styles.BarChart}
        style={{
          backgroundImage: `linear-gradient(to right, #07A417 0%, #07A417 ${percentageDone}%,#393838 ${percentageDone}%,#393838 100%)`,
        }}
        data-testid="BarChart"
      >
        &nbsp;
      </div>
    </div>
  );
};

export default BarChart;
