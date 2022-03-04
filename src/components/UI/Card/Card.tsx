import React, { FC } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: FC<CardProps> = (props) => (
  <div className={`${styles.Card} ${props.className ?? ""}`} data-testid="Card">
    {props.children}
  </div>
);

export default Card;
