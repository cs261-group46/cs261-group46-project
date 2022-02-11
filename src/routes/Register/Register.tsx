import React, { FC } from 'react';
// import styles from './Register.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import PasswordInput from "../../components/Register/PasswordInput/PasswordInput";
import Select from "../../components/UI/FormInput/Select/Select";
import Button from "../../components/UI/Button/Button";
import useInput from "../../hooks/UseInput/UseInput";

interface RegisterProps {}

const DUMMY_DEPARTMENTS = [{option_id: "1", option: "Department 1"}]

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password: string) {
    return true
}

function validateRepeatedPassword(password: string, repeatedPassword:string) {
    return password === repeatedPassword;
}

const Register: FC<RegisterProps> = () => {
    const [
        enteredEmail,
        ,
        isInputEmailValid,
        emailChangeHandler,
        emailBlurHandler
    ] = useInput(validateEmail)

    const [
        enteredPassword,
        ,
        isInputPasswordValid,
        passwordChangeHandler,
        passwordBlurHandler
    ] = useInput(validatePassword)

    const [
        enteredRepeatedPassword,
        ,
        isInputRepeatedPasswordValid,
        repeatedPasswordChangeHandler,
        repeatedPasswordBlurHandler
    ] = useInput(validateRepeatedPassword.bind(null, enteredPassword))



    return (
        <MainLayout title="Register">
            <TextInput icon="✉️" value={enteredEmail} isValid={isInputEmailValid} onChange={emailChangeHandler} onBlur={emailBlurHandler}  id="email" label="Email" placeholder="Please provide your email address"/>
            <PasswordInput value={enteredPassword} isValid={isInputPasswordValid} onChange={passwordChangeHandler} onBlur={passwordBlurHandler} />
            <TextInput value={enteredRepeatedPassword} isValid={isInputRepeatedPasswordValid} onChange={repeatedPasswordChangeHandler} onBlur={repeatedPasswordBlurHandler} icon="🔒️" type="password" id="password_r" label="Repeat Password" placeholder="Please provide your password again"/>
            <Select icon="👥" id="department" placeholder="Please select your department" label="Department" options={DUMMY_DEPARTMENTS}/>
            <Button icon="👑">Register</Button>
        </MainLayout>
    )
};

export default Register;
