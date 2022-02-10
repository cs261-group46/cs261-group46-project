import React, { FC } from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
    title: string
}

const Header: FC<HeaderProps> = (props) => (
  <header className={styles.Header} data-testid="Header">
      <h1>{props.title}</h1>
  </header>
);

export default Header;
