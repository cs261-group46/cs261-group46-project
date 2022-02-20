import React, {FC, useState} from 'react';
import styles from './Login.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import useInput from "../../hooks/UseInput/UseInput";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import Button from "../../components/UI/Button/Button";
import {useNavigate} from "react-router-dom";
import SystemMessage from "../../components/UI/SystemMessage/SystemMessage";

interface LoginProps {}

const Login: FC<LoginProps> = () => {
    const {
        enteredValue: enteredEmail,
        isInputValid: isInputEmailValid,
        isValueValid: isEmailValueValid,
        changeHandler: emailChangeHandler,
        blurHandler: emailBlurHandler,
        // TODO: i dont want to have to define email checking again
    } = useInput<string>(() => true, "");

    const {
        enteredValue: enteredPassword,
        isInputValid: isInputPasswordValid,
        isValueValid: isPasswordValueValid,
        changeHandler: passwordChangeHandler,
        blurHandler: passwordBlurHandler,
        // TODO: i dont want to have to define password checking again
    } = useInput<string>(() => true, "");

    const [error, setError] = useState(false);

    let navigate = useNavigate();

    const sendRegistrationData = async () => {
        const body = {
            email: enteredEmail,
            password: enteredPassword,
        };

        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(body), // body data type must match "Content-Type" header
        });

        const returnedData = await response.json();

        console.log(returnedData);

        if (response.ok) {
            navigate("/dashboard");
        } else {
            setError(true);
        }
    };

    const registrationHandler = () => {
        if (
            isEmailValueValid &&
            isPasswordValueValid
        ) {
            sendRegistrationData();
        }
    };

    return <MainLayout title={"Login"}>
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
            icon="🔒️"
            value={enteredPassword}
            isValid={isInputPasswordValid}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            id="password"
            label="Password"
            type="password"
            placeholder="Please enter your password"
        />

        <Button icon="👑" onClick={registrationHandler} buttonStyle={"primary"}>
            Login
        </Button>

        <SystemMessage sort={"inline"} type={"warning"} description={"Login failed! Please try again later."} visible={error} setVisible={setError}/>

        <div data-testid="Login"/>
    </MainLayout>
}

export default Login;
