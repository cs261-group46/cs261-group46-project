import React, { FC } from "react";
import styles from "./Title.module.scss";

interface TitleProps {
  text: string;
}

const Title: FC<TitleProps> = (props) => (
  <h2 className={styles.Title} data-testid="Title">
    {props.text}
  </h2>
);

export default Title;
