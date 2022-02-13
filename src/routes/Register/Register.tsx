import React, { FC, useState } from 'react';
// import styles from './Register.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import PasswordInput from "../../components/Register/PasswordInput/PasswordInput";
import Select from "../../components/UI/FormInput/Select/Select";
import MultiSelect, { DropDown } from "../../components/UI/FormInput/MultiSelect/MultiSelect";
import Button from "../../components/UI/Button/Button";
import useInput from "../../hooks/UseInput/UseInput";

interface RegisterProps {}

const DUMMY_DEPARTMENTS = [{option_id: "1", option: "Department 1"}]

// temporary (for testing):
type LabelledList<T> = {label: string, value: T}[]
const multiSelectChangeHandler = (value: LabelledList<number>) => {}
// end of temp

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
// enteredValue,
//         isValueValid,
//         isInputValid,
//         changeHandler,
//         blurHandler,
//         reset
const Register: FC<RegisterProps> = () => {
    const {
        enteredValue: enteredEmail,
        isInputValid: isInputEmailValid,
        changeHandler: emailChangeHandler,
        blurHandler: emailBlurHandler
        } = useInput(validateEmail)

    const {
        enteredValue: enteredPassword,
        isInputValid: isInputPasswordValid,
        changeHandler: passwordChangeHandler,
        blurHandler: passwordBlurHandler
    } = useInput(validatePassword)
    
    const {
        enteredValue: enteredRepeatedPassword,
        isInputValid: isInputRepeatedPasswordValid,
        changeHandler: repeatedPasswordChangeHandler,
        blurHandler: repeatedPasswordBlurHandler
    } = useInput(validateRepeatedPassword.bind(null, enteredPassword))

    let [expertises, setExpertises] = useState([{label: "1", value: 1}, {label: "2", value: 2}]);

    return (
        <MainLayout title="Register">
            <TextInput icon="✉️" value={enteredEmail} isValid={isInputEmailValid} onChange={emailChangeHandler} onBlur={emailBlurHandler}  id="email" label="Email" placeholder="Please provide your email address"/>
            <PasswordInput value={enteredPassword} isValid={isInputPasswordValid} onChange={passwordChangeHandler} onBlur={passwordBlurHandler} />
            <TextInput value={enteredRepeatedPassword} isValid={isInputRepeatedPasswordValid} onChange={repeatedPasswordChangeHandler} onBlur={repeatedPasswordBlurHandler} icon="🔒️" type="password" id="password_r" label="Repeat Password" placeholder="Please provide your password again"/>
            <Select icon="👥" id="department" placeholder="Please select your department" label="Department" options={DUMMY_DEPARTMENTS}/>
            <Button icon="👑">Register</Button>
            <p>For testing:</p>
            <MultiSelect icon='💪' id='expertise' label='Fields of Expertise'
                default={0}
                options={[{label: "1", value: 1}, {label: "2", value: 2}]} 
                value={expertises} 
                isValid={true} 
                onChange={setExpertises} 
                searchPromise={(search) => {
                    return new Promise(resolve => resolve([{label: "Tracking", value: "tracking"}]))
                }}
            />
            {/* <DropDown callback={() => {}} options={["a", "b"]}/> */}
        </MainLayout>
    )
};

export default Register;
