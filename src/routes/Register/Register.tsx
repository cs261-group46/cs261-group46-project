import React, { FC, useEffect } from "react";
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

function validateExpertises(_experises: MultiSelectOptions<string>) {
  return true;
}

const Register: FC<RegisterProps> = () => {
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

  const {
    enteredValue: enteredExpertises,
    isInputValid: isInputExpertisesValid,
    changeHandler: expertisesChangeHandler,
  } = useInput<MultiSelectOptions<string>>(validateExpertises, []);

  const sendRegstrationData = async () => {
    const body = {
      email: enteredEmail,
      password: enteredPassword,
      department: "test",
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
  const registrationHandler = () => {
    if (isInputEmailValid && isInputPasswordValid && enteredRepeatedPassword) {
      sendRegstrationData();
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

  const fetchDepartment = async () => {
    const departments = await fetch("/api/departments");
    const body = await departments.json();
    console.log(body);
  };

  return (
    <MainLayout title="Register">
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
        options={DUMMY_DEPARTMENTS}
      />
      <Button icon="👑" onClick={registrationHandler} buttonStyle={"primary"}>
        Register
      </Button>

      <p>For testing:</p>

      <MultiSelect
        id="expertise"
        label="Fields of Expertise"
        value={enteredExpertises}
        isValid={isInputExpertisesValid}
        onChange={expertisesChangeHandler}
        onBlur={emailBlurHandler}
        icon="💪"
        searchPromise={searchPromise}
      />
    </MainLayout>
  );
};

export default Register;
