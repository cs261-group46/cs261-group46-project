import React, { FC } from 'react';
import styles from './Header.module.scss';
import Logo from "../../../logo";

interface HeaderProps {
    title: string
}

const Header: FC<HeaderProps> = (props) => (
  <header className={styles.Header} data-testid="Header">
      <Logo scale="0.16" />
      <h1>{props.title}</h1>
  </header>
);

export default Header;
