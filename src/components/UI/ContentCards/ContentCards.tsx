import React, { FC } from "react";
import styles from "./ContentCards.module.scss";

interface ContentCardsProps {}

const ContentCards: FC<ContentCardsProps> = (props) => (
  <div className={styles.ContentCards} data-testid="ContentCards">
    {props.children}
  </div>
);

export default ContentCards;
