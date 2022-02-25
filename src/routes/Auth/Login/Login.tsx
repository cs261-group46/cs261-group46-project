import React, { FC, FormEventHandler } from "react";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import styles from "./Login.module.scss";
import useInput from "../../../hooks/UseInput/UseInput";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/UI/Button/Button";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";

interface LoginProps {}

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password: string) {
  return password.length > 0;
}

const Login: FC<LoginProps> = (props) => {
  const navigate = useNavigate();

  const {
    enteredValue: enteredEmail,
    isInputValid: isInputEmailValid,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
  } = useInput<string>("", validateEmail);

  const {
    enteredValue: enteredPassword,
    isInputValid: isInputPasswordValid,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
  } = useInput<string>("", validatePassword);

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isInputEmailValid && isInputPasswordValid) {
      sendLoginData();
    }
  };

  const sendLoginData = async () => {
    const body = {
      email: enteredEmail,
      password: enteredPassword,
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    const returnedData = await response.json();
    console.log(returnedData);

    // TODO : if unsuccesfull, show errors

    if (returnedData.successful) navigate("/dashboard");
  };

  return (
    <MainLayout title="Login">
      <form onSubmit={submitHandler}>
        <TextInput
          icon="✉️"
          value={enteredEmail}
          isValid={isInputEmailValid}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          id="email"
          label="Email"
          placeholder="Please provide your email address"
        />

        <TextInput
          value={enteredPassword}
          isValid={isInputPasswordValid}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          icon="🔒️"
          type="password"
          id="password"
          label="Password"
          placeholder="Please provide your password"
        />
        <Button icon="👑" buttonStyle={"primary"} type="submit">
          Login
        </Button>
      </form>
    </MainLayout>
  );
};

export default Login;
