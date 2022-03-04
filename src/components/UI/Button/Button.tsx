import React, { FC } from "react";
import styles from "./Button.module.scss";
import Icon from "../Icon/Icon";
import { ButtonStyle } from "./Button.d";
import { Link } from "react-router-dom";

export interface ButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  buttonStyle?: ButtonStyle;
  href?: string;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
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
      {props.children && (
        <div className={styles.Description}>{props.children}</div>
      )}
    </button>
  );

  return props.href ? (
    <div className={`${styles.Button} ${props.className}`}>
      <Link className={styles.Button} to={props.href}>
        {buttonElem}
      </Link>
    </div>
  ) : (
    <div className={`${styles.Button} ${props.className}`}>{buttonElem}</div>
  );
};

export default Button;
