import React, { FC } from "react";
import styles from "./Button.module.scss";
import Icon from "../Icon/Icon";
import { ButtonStyle } from "./Button.d";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  buttonStyle?: ButtonStyle;
  href?: string;
  type?: "button" | "submit" | "reset" | undefined
}

const Button: FC<ButtonProps> = (props) => {
  const styleName: ButtonStyle =
    props.buttonStyle !== undefined ? props.buttonStyle : "default";

  const buttonElem = (
    <button
      onClick={props.onClick}
      className={`${styles[styleName]}`}
      data-testid="Button"
      type={props.type}
    >
      {props.icon && <Icon icon={props.icon} className={styles.Icon} />}
      {props.children}
    </button>
  );

  return props.href ? (
    <Link className={styles.Button} to={props.href}>
      {buttonElem}
    </Link>
  ) : (
    <div className={styles.Button}>{buttonElem}</div>
  );
};

export default Button;
