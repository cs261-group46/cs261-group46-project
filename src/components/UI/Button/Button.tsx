import React, { FC, MouseEventHandler } from "react";
import styles from "./Button.module.scss";
import Icon from "../Icon/Icon";

interface ButtonProps {
  children: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
}

const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={styles.Button}
      data-testid="Button"
    >
      {props.icon && <Icon icon={props.icon} className={styles.Icon} />}
      {props.children}
    </button>
  );
};

export default Button;
