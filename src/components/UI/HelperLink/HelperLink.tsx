import React, { FC } from "react";
import { Link } from "react-router-dom";
import styles from "./HelperLink.module.scss";

interface HelperLinkProps {
  onClick?: () => void;
  href?: string;
  description: string;
  linkText: string;
}

const HelperLink: FC<HelperLinkProps> = (props) => {
 

  return (
    <div className={styles.HelperLink}>
      <p>{props.description}</p>
      {props.href && <Link to={props.href}>{props.linkText}</Link>}
      {!props.href && <button onClick={props.onClick}>{props.linkText}</button>}
    </div>
  );
};

export default HelperLink;
