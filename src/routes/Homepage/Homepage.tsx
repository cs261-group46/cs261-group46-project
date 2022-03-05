import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Homepage.module.scss";
import Button from "../../components/UI/Button/Button";
import Logo from "../../logo";
import useLogin from "../../hooks/UseLogin/UseLogin";
import { useNavigate } from "react-router-dom";

interface HomepageProps {}

interface Shape {
  x: number;
  y: number;
  rotation: number;
  element: JSX.Element;
}

const square = (fill: string) => <rect width="100" height="100" fill={fill} />;
const triangle = (fill: string) => (
  <path d="M0 0 L100 0 L50 100 L0 0" fill={fill} />
);
const circle = (fill: string) => <circle r="50" cx="50" cy="50" fill={fill} />;

const Homepage: FC<HomepageProps> = () => {
  const navigate = useNavigate();
  const loginState = useLogin();

  const requestRef = useRef<number>(0);

  const [squares, setSquares] = useState<Shape[]>(
    Array(50).fill({ x: 0, y: 0, rotation: 0 })
  );

  useEffect(() => {
    if (loginState.state === "logged_in") {
      navigate("/dashboard");
    }
  }, [loginState, navigate]);

  const animate = useCallback((time: number) => {
    const speed = 30000;
    const perCol = Math.floor(window.innerHeight / 100);
    const cols = Math.floor(window.innerWidth / 100);

    requestRef.current = requestAnimationFrame(animate);
    setSquares(
      Array(perCol * cols)
        .fill(0)
        .map((_, index) => {
          const offset = time + index * (speed / perCol);
          const col = Math.floor(offset / speed) % cols;
          const colOffset = col % 2 ? offset : offset - speed / perCol / 2;
          // the weird percol calc should keep the red chance from aligning with percol (which looks weird)
          const fill = index % (perCol * 2 + 3) === 0 ? "#EA596E" : "#AFAFAF";
          const element = [square, circle, triangle][index % 3](fill);

          return {
            x: (col + 0.5) / cols,
            y: (colOffset % speed) / speed,
            rotation: (offset % speed) / speed,
            element: element,
          };
        })
    );
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  function getOpacity(y: number) {
    var opacity = 1; // default if in no range
    if (y < 0.2) opacity = y * 5;
    if (y > 0.8) opacity = (1 - y) * 5;
    return opacity / 3;
  }

  return (
    <div className={styles.Homepage} data-testid="Homepage">
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.buttons}>
        <Button href={"/register"}>Register</Button>
        <Button href={"/login"}>Login</Button>
      </div>
      <div className={styles.animationholder}>
        {squares.map((shape, index) => (
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={index}
            className={styles.fallingshape}
            style={{
              left: `calc(${shape.x * 100}vw - 12px)`,
              top: `calc(${shape.y * 100}vh - 25px)`,
              rotate: `${shape.rotation * 360}deg`,
              opacity: getOpacity(shape.y),
            }}
          >
            {shape.element}
          </svg>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
