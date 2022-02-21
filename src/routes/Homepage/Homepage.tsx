import React, { FC } from 'react';
import styles from './Homepage.module.scss';
import Button from "../../components/UI/Button/Button";
import Logo from "../../logo";

interface HomepageProps {}

const Homepage: FC<HomepageProps> = () => {
  return <div className={styles.Homepage} data-testid="Homepage">
    <Logo scale={0.5}/>
    <div className={styles.buttons}>
      <Button href={"/register"}>Register</Button>
      <Button href={"/login"}>Login</Button>
    </div>
  </div>
}

export default Homepage;
