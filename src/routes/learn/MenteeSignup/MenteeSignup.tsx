import React, { FC } from "react";
// import styles from './MenteeSignup.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import MultiSelect from "../../../components/UI/FormInput/MultiSelect/MultiSelect";
import { MultiSelectOptions } from "../../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";

interface MenteeSignupProps {}

const MenteeSignup: FC<MenteeSignupProps> = () => {
  const {
    isInputValid: isInterestsInputValid,
    isValueValid: isInterestsValueValid,
    changeHandler: interestsChangeHandler,
    blurHandler: interestsBlurHandler,
    enteredValue: interests,
  } = useInput<MultiSelectOptions<string>>([], (value) => value.length > 0);

  let navigate = useNavigate();

  const registrationHandler = () => {
    if (isInterestsValueValid) {
      // sendRegistrationData();
      navigate("/dashboard");
    }
  };

  return (
    <MainLayout title={"Sign up to be a mentee"}>
      <MultiSelect
        id={"interests"}
        label={"What are you interested in learning?"}
        isValid={isInterestsInputValid}
        value={interests}
        onChange={interestsChangeHandler}
        onBlur={interestsBlurHandler}
      />

      <Button icon="👑" onClick={registrationHandler} buttonStyle={"primary"}>
        Register
      </Button>

      <div data-testid="MenteeSignup" />
    </MainLayout>
  );
};

export default MenteeSignup;
