import React, { FC } from 'react';
import styles from './Footer.module.scss';

interface FooterProps {}

const Footer: FC<FooterProps> = () => (
  <footer className={styles.Footer} data-testid="Footer"/>
);

export default Footer;
