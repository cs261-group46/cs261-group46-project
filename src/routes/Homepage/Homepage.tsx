import React, {FC, useEffect} from 'react';
import styles from './Homepage.module.scss';
import Button from "../../components/UI/Button/Button";
import Logo from "../../logo";
import useLogin from "../../hooks/UseLogin/UseLogin";
import {useNavigate} from "react-router-dom";

interface HomepageProps {}

const Homepage: FC<HomepageProps> = () => {
  const navigate = useNavigate();
  const loginState = useLogin();

  useEffect(() => {
    if (loginState.state === "logged_in") {
      navigate("/dashboard");
    }
  }, [loginState, navigate]);

  return <div className={styles.Homepage} data-testid="Homepage">
    <Logo scale={0.5}/>
    <div className={styles.buttons}>
      <Button href={"/register"}>Register</Button>
      <Button href={"/login"}>Login</Button>
    </div>
  </div>
}

export default Homepage;
