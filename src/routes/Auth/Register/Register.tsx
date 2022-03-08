import React, {
  FC,
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import PasswordInput from "../../../components/Register/PasswordInput/PasswordInput";
import Select from "../../../components/UI/FormInput/Select/Select";
import Button from "../../../components/UI/Button/Button";
import useInput from "../../../hooks/UseInput/UseInput";
import {
  SelectOption,
  SelectOptions,
} from "../../../components/UI/FormInput/Select/Select";
import { useNavigate } from "react-router-dom";
import { custom, index } from "../../../api/api";
import { DepartmentType } from "../../../types/Department";
import ErrorMessagesContext from "../../../store/ErrorMessagesContext";

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

function validateDepartment(_department: SelectOption<number>) {
  return _department.value !== -1;
}

// type Verifier = {
//   userId: number | null | undefined;
// };

const Register: FC = () => {
  const errorsCtx = useContext(ErrorMessagesContext);

  const [departments, setDepartments] = useState<SelectOptions<number>>([]);
  let navigate = useNavigate();

  useEffect(() => {
    getDepartments();
  }, []);

  // const fetchDepartments = async () => {
  //   const dep = await fetch("/api/departments");
  //   const body = await dep.json();
  //   setDepartments(body.result);
  // };

  const { setErrorsHandler } = errorsCtx;
  const getDepartments = useCallback(async () => {
    try {
      const data = await index({
        resource: "departments",
      });
      console.log(data);

      setDepartments(
        data.departments.map((department: DepartmentType) => ({
          value: department.id,
          label: department.name,
        }))
      );
    } catch (errors) {
      const errs = errors as string[];
      setErrorsHandler(errs);
    }
  }, [setErrorsHandler]);

  const showAllErrors = () => {
    firstNameBlurHandler();
    lastNameBlurHandler();
    emailBlurHandler();
    passwordBlurHandler();
    repeatedPasswordBlurHandler();
    departmentBlurHandler();
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (
      isValueFirstNameValid &&
      isValueLastNameValid &&
      isValueEmailValid &&
      isValuePasswordValid &&
      isValueRepeatedPasswordValid &&
      isValueDeprtmentPasswordValid
    ) {
      sendRegistrationData();
    } else {
      showAllErrors();
    }
  };

  const sendRegistrationData = async () => {
    const department = {
      name: enteredDepartment.label,
      id: enteredDepartment.value,
    };
    const body = {
      email: enteredEmail,
      password: enteredPassword,
      first_name: enteredFirstName,
      last_name: enteredLastName,
      department: department,
    };

    try {
      await custom({
        endpoint: "/auth/register",
        method: "POST",
        body: body,
      });

      navigate("/register/verifyemail");
    } catch (error) {
      const message = errorsCtx.getErrorMessage(error);
      errorsCtx.setErrorsHandler(message);
    }
  };

  const {
    enteredValue: enteredFirstName,
    isInputValid: isInputFirstNameValid,
    isValueValid: isValueFirstNameValid,
    changeHandler: firstNameChangeHandler,
    blurHandler: firstNameBlurHandler,
  } = useInput<string>("", validateName);

  const {
    enteredValue: enteredLastName,
    isInputValid: isInputLastNameValid,
    isValueValid: isValueLastNameValid,
    changeHandler: lastNameChangeHandler,
    blurHandler: lastNameBlurHandler,
  } = useInput<string>("", validateSurname);

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

  const {
    enteredValue: enteredRepeatedPassword,
    isInputValid: isInputRepeatedPasswordValid,
    isValueValid: isValueRepeatedPasswordValid,
    changeHandler: repeatedPasswordChangeHandler,
    blurHandler: repeatedPasswordBlurHandler,
  } = useInput<string>(
    "",
    validateRepeatedPassword.bind(null, enteredPassword)
  );

  const {
    enteredValue: enteredDepartment,
    isInputValid: isInputDepartmentValid,
    isValueValid: isValueDeprtmentPasswordValid,
    changeHandler: departmentChangeHandler,
    blurHandler: departmentBlurHandler,
  } = useInput<SelectOption<number>>({ value: -1 }, validateDepartment);

  return (
    <MainLayout title="Register">
      <form onSubmit={submitHandler}>
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
        <Button icon="👑" buttonStyle={"primary"} type="submit">
          Register
        </Button>
      </form>
      <div data-testid="Register" />
    </MainLayout>
  );
};

export default Register;
