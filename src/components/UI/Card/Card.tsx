import React, { FC } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  children: React.ReactChild;
}

const Card: FC<CardProps> = (props) => (
  <div className={styles.Card} data-testid="Card">
    {props.children}
  </div>
);

export default Card;
