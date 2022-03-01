import React, { FC } from "react";
import styles from "./Tag.module.scss";

interface TagProps {
  children: React.ReactNode;
}

const Tag: FC<TagProps> = (props) => (
  <div className={styles.Tag} data-testid="Tag">
    {props.children}
  </div>
);

export default Tag;
