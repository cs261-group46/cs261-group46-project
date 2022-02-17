import React, { FC } from "react";
import styles from "./Icon.module.scss";
import Twemoji from "react-twemoji-17";

interface IconProps {
  icon: React.ReactNode;
  className?: string;
  options?: object;
}

const Icon: FC<IconProps> = (props) => (
  <Twemoji
    noWrapper={true}
    options={{ className: styles.Emoji, ...props.options }}
  >
    <div data-testid="Icon" className={props.className}>{props.icon}</div>
  </Twemoji>
);

export default Icon;
