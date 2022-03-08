import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  type?: "inline" | "centered";
  size?: number;
}

interface LoadingDot {
  state: number; // a number 0 - 1 for how 'loading' this dot is, with 1 being big and red
}

const LoadingSpinner: FC<LoadingSpinnerProps> = (props) => {
  const type = props.type ?? "centered";
  const size = props.size ?? 100;

  const loaderLength = 3;
  const requestRef = useRef<number>(0);

  const [dots, setDots] = useState<LoadingDot[]>();

  const animate = useCallback((time: number) => {
    const speed = 1000;
    const interval = loaderLength * speed;

    const timedelta = time % interval;
    const slot = timedelta / speed;

    requestRef.current = requestAnimationFrame(animate);

    function toSin(t: number) {
      return Math.sin(t * Math.PI);
    }

    setDots(
      Array(loaderLength)
        .fill(0)
        .map((_, index) => ({
          state: slot >= index && slot < index + 1 ? toSin(slot - index) : 0,
        }))
    );
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return (
    <div
      className={`${styles.LoadingSpinner} ${
        type === "inline" && styles.inline
      }`}
      data-testid="LoadingSpinner"
    >
      {dots &&
        dots.map((dot) => (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle r={40 + dot.state * 10} cx="50" cy="50" fill={"#DFDFDF"} />
            <circle
              r={40 + dot.state * 10}
              cx="50"
              cy="50"
              fill={"#EA596E"}
              opacity={dot.state}
            />
          </svg>
        ))}
    </div>
  );
};

export default LoadingSpinner;
