import React, { FC, FormEventHandler, useContext } from "react";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import useInput from "../../../hooks/UseInput/UseInput";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/UI/Button/Button";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import UserDataContext from "../../../store/UserDataContext";
import { custom } from "../../../api/api";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import ErrorMessagesContext from "../../../store/SystemMessagesContext";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";

interface LoginProps {}

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password: string) {
  return password.length > 0;
}

const Login: FC<LoginProps> = () => {
  UseVerifyUser({
    isProtected: false,
  });

  const showMessage = UseSystemMessage();

  const navigate = useNavigate();

  const showAllErrors = () => {
    emailBlurHandler();
    passwordBlurHandler();
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueEmailValid && isValuePasswordValid) {
      sendLoginData();
    } else {
      showAllErrors();
    }
  };

  const sendLoginData = async () => {
    const body = {
      email: enteredEmail,
      password: enteredPassword,
    };

    try {
      await custom({
        endpoint: "/auth/login",
        method: "POST",
        body: body,
      });
      navigate("/dashboard");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const {
    enteredValue: enteredEmail,
    isInputValid: isInputEmailValid,
    isValueValid: isValueEmailValid,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
  } = useInput<string>("", validateEmail);

  const {
    enteredValue: enteredPassword,
    isInputValid: isInputPasswordValid,
    isValueValid: isValuePasswordValid,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
  } = useInput<string>("", validatePassword);

  return (
    <MainLayout title="Login">
      <form onSubmit={submitHandler} data-testid={"Login"}>
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
