import React, { FC, useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import PasswordInput from "../../components/Register/PasswordInput/PasswordInput";
import Select from "../../components/UI/FormInput/Select/Select";
import Button from "../../components/UI/Button/Button";
import useInput from "../../hooks/UseInput/UseInput";
import {
  SelectOption,
  SelectOptions,
} from "../../components/UI/FormInput/Select/Select.d";
import {useNavigate} from "react-router-dom";
import SystemMessage from "../../components/UI/SystemMessage/SystemMessage";

interface RegisterProps {}

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password: string) {
  let passwordRating = 0;
  const passwordLength = password.length;
  const capitalLetters = /[A-Z]/;
  const lowercaseLetters = /[a-z]/;
  const numbers = /[0-9]/;
  const symbol = /-|_|\.|,|\[|]|\(|'|\)|`|@|!|\\|\/|\^|\*|\?|\||\$/;
  if (passwordLength < 10) return false;
  if (capitalLetters.test(password)) passwordRating++;
  if (lowercaseLetters.test(password)) passwordRating++;
  if (numbers.test(password)) passwordRating++;
  if (symbol.test(password)) passwordRating++;
  return passwordRating >= 3;
}

function validateName(name: string) {
  return name.length > 0 && name.length <= 20;
}

function validateSurname(surname: string) {
  return surname.length > 0 && surname.length <= 20;
}

function validateRepeatedPassword(
  password: string | undefined,
  repeatedPassword: string | undefined
): boolean {
  return (
    password !== undefined &&
    repeatedPassword !== undefined &&
    password === repeatedPassword
  );
}
function validateDepartment(department: SelectOption<number>) {
  return department.id !== -1;
}

const Register: FC<RegisterProps> = () => {
  const {
    enteredValue: enteredFirstName,
    isInputValid: isInputFirstNameValid,
    changeHandler: firstNameChangeHandler,
    blurHandler: firstNameBlurHandler,
  } = useInput<string>(validateName, "");

  const {
    enteredValue: enteredLastName,
    isInputValid: isInputLastNameValid,
    changeHandler: lastNameChangeHandler,
    blurHandler: lastNameBlurHandler,
  } = useInput<string>(validateSurname, "");

  const {
    enteredValue: enteredEmail,
    isInputValid: isInputEmailValid,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
  } = useInput<string>(validateEmail, "");

  const {
    enteredValue: enteredPassword,
    isInputValid: isInputPasswordValid,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
  } = useInput<string>(validatePassword, "");

  const {
    enteredValue: enteredRepeatedPassword,
    isInputValid: isInputRepeatedPasswordValid,
    changeHandler: repeatedPasswordChangeHandler,
    blurHandler: repeatedPasswordBlurHandler,
  } = useInput<string>(
    validateRepeatedPassword.bind(null, enteredPassword),
    ""
  );

  const {
    enteredValue: enteredDepartment,
    isInputValid: isInputDepartmentValid,
    changeHandler: departmentChangeHandler,
    blurHandler: departmentBlurHandler,
  } = useInput<SelectOption<number>>(validateDepartment, { id: -1 });

  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const sendRegistrationData = async () => {
    const body = {
      email: enteredEmail,
      password: enteredPassword,
      password_repeat: enteredRepeatedPassword,
      first_name: enteredFirstName,
      last_name: enteredLastName,
      department: enteredDepartment,
    };

    const response = await fetch("/api/user/register", {
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
      navigate("/register/verify-email");
    } else {
      setError(true);
    }
  };

  const registrationHandler = () => {
    firstNameBlurHandler();
    lastNameBlurHandler();
    emailBlurHandler();
    passwordBlurHandler();
    repeatedPasswordBlurHandler();
    departmentBlurHandler();

    if (
      isInputFirstNameValid &&
      isInputLastNameValid &&
      isInputEmailValid &&
      isInputPasswordValid &&
      isInputRepeatedPasswordValid &&
      isInputDepartmentValid
    ) {
      sendRegistrationData();
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const [departments, setDepartments] = useState<SelectOptions<number>>([]);

  const fetchDepartments = async () => {
    console.log("sending");

    const dep = await fetch("/api/departments");
    const body = await dep.json();
    console.log(body.result);

    setDepartments(body.result);
  };

  return (
    <MainLayout title="Register">
      <TextInput
        icon="1️⃣"
        value={enteredFirstName}
        isValid={isInputFirstNameValid}
        onChange={firstNameChangeHandler}
        onBlur={firstNameBlurHandler}
        id="firstname"
        label="First Name"
        placeholder="Please provide your first name"
      />

      <SystemMessage sort={"inline"} type={"alert"} description={"Please provide your first name"} visible={!isInputFirstNameValid} noX/>

      <TextInput
        icon="2️⃣"
        value={enteredLastName}
        isValid={isInputLastNameValid}
        onChange={lastNameChangeHandler}
        onBlur={lastNameBlurHandler}
        id="lastname"
        label="Last Name"
        placeholder="Please provide your last name"
      />

      <SystemMessage sort={"inline"} type={"alert"} description={"Please provide your last name"} visible={!isInputLastNameValid} noX/>

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

      <SystemMessage sort={"inline"} type={"alert"} description={"Please provide your last name"} visible={!isInputEmailValid} noX/>

      <PasswordInput
        value={enteredPassword}
        isValid={isInputPasswordValid}
        onChange={passwordChangeHandler}
        onBlur={passwordBlurHandler}
      />

      <SystemMessage sort={"inline"} type={"alert"} description={"Your password is not secure enough"} visible={!isInputPasswordValid} noX/>

      <TextInput
        value={enteredRepeatedPassword}
        isValid={isInputRepeatedPasswordValid}
        onChange={repeatedPasswordChangeHandler}
        onBlur={repeatedPasswordBlurHandler}
        icon="🔒️"
        type="password"
        id="password_r"
        label="Repeat Password"
        placeholder="Please provide your password again"
      />

      <SystemMessage sort={"inline"} type={"alert"} description={"Passwords do not match"} visible={!isInputRepeatedPasswordValid} noX/>

      <Select
        value={enteredDepartment}
        isValid={isInputDepartmentValid}
        onChange={departmentChangeHandler}
        onBlur={departmentBlurHandler}
        icon="👥"
        id="department"
        placeholder="Please select your department"
        label="Department"
        options={departments}
      />

      <SystemMessage sort={"inline"} type={"alert"} description={"Please select a Department"} visible={!isInputDepartmentValid} noX/>

      <Button icon="👑" onClick={registrationHandler} buttonStyle={"primary"}>
        Register
      </Button>
      <SystemMessage sort={"inline"} type={"warning"} description={"Registration failed! Please try again later."} visible={error} setVisible={setError}/>
      <div data-testid="Register" />
    </MainLayout>
  );
};

export default Register;
