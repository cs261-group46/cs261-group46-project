import React, { FC } from 'react';
import styles from './Label.module.scss';
import Icon from "../../Icon/Icon";

interface LabelProps {
    htmlFor: string
    icon?: React.ReactNode
}

const Label: FC<LabelProps> = (props) => (
  <div className={styles.Label}>
      {props.icon && <Icon icon={props.icon} className={styles.Icon}/>}
      <label htmlFor={props.htmlFor}>{props.children}</label>
  </div>
);

export default Label;
