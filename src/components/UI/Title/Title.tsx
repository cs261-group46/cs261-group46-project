import React, { FC } from "react";
import styles from "./Title.module.scss";

interface TitleProps {
  text: string;
  className?: string;
}

const Title: FC<TitleProps> = (props) => (
  <h2
    className={`${styles.Title} ${props.className ?? ""}`}
    data-testid="Title"
  >
    {props.text}
  </h2>
);

export default Title;
