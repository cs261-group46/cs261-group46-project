import React, { FC } from "react";
import styles from "./Button.module.scss";
import Icon from "../Icon/Icon";

type ButtonStyle = "primary" | "default"

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  buttonStyle?: ButtonStyle
  href?: string
}

// utility function that just checks the type of input param
function ensureNever(_: never) {}

// maps an inputted style into the scoped css class
function mapStyleName(styleName: ButtonStyle) {
  if (styleName === "primary") return styles.primary
  if (styleName === "default") return styles.default
  ensureNever(styleName) // makes sure all branches are handled
}

const Button: FC<ButtonProps> = (props) => {
  const styleName: ButtonStyle = props.buttonStyle !== undefined ? props.buttonStyle : "default"
  const style = mapStyleName(styleName)

  const buttonElem =
      <button
          onClick={props.onClick}
          className={`${style}`}
          data-testid="Button"
      >
        {props.icon && <Icon icon={props.icon} className={styles.Icon} />}
        {props.children}
      </button>

  return (
      props.href
          ? <a href={props.href} className={styles.Button}>{buttonElem}</a> // if link button
          : <div className={styles.Button}>{buttonElem}</div>
  );
};

export default Button;
