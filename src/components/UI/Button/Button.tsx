import React, { FC } from "react";
import styles from "./Button.module.scss";
import Icon from "../Icon/Icon";

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
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
