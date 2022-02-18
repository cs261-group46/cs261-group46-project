import React, { FC, useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import PasswordInput from "../../components/Register/PasswordInput/PasswordInput";
import Select from "../../components/UI/FormInput/Select/Select";
import MultiSelect from "../../components/UI/FormInput/MultiSelect/MultiSelect";
import Button from "../../components/UI/Button/Button";
import useInput from "../../hooks/UseInput/UseInput";
import {
  SelectOption,
  SelectOptions,
} from "../../components/UI/FormInput/Select/Select.d";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import { useNavigate } from "react-router-dom";

interface RegisterProps {}

const DUMMY_DEPARTMENTS: SelectOptions = [{ id: "1", label: "Department 1" }];

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
function validateDepartment(_department: SelectOption) {
  return true;
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
  } = useInput<SelectOption>(validateDepartment, { id: "0" });

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
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    const returnedData = await response.json();

    console.log(returnedData);
  };

  let navigate = useNavigate();

  const registrationHandler = () => {
    if (
      isInputFirstNameValid &&
      isInputLastNameValid &&
      isInputEmailValid &&
      isInputPasswordValid &&
      enteredRepeatedPassword &&
      isInputDepartmentValid
    ) {
      sendRegistrationData();
      navigate("/dashboard");
    }
  };

  const searchPromise: SearchPromise = (_search) => {
    return new Promise((resolve) =>
      resolve([
        { label: "Tracking", value: "tracking" },
        { label: "Training", value: "training" },
      ])
    );
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const [departments, setDepartments] = useState<SelectOptions>([]);

  const fetchDepartment = async () => {
    const departments = await fetch("/api/departments");
    const body = await departments.json();
    setDepartments([]);
    console.log(body);
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
      <PasswordInput
        value={enteredPassword}
        isValid={isInputPasswordValid}
        onChange={passwordChangeHandler}
        onBlur={passwordBlurHandler}
      />
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
      <Button icon="👑" onClick={registrationHandler} buttonStyle={"primary"}>
        Register
      </Button>
      <div data-testid="Register"/>
    </MainLayout>
  );
};

export default Register;
