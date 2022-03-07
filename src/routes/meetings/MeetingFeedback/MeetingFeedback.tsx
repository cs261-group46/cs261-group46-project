import React, { FC, FormEventHandler } from "react";
import styles from "./MeetingFeedback.module.scss";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";

interface MeetingFeedbackProps {}

const MeetingFeedback: FC<MeetingFeedbackProps> = () => {
  const {
    enteredValue,
    isInputValid,
    isValueValid,
    changeHandler,
    blurHandler,
  } = useInput("", (value) => value.length > 0);

  const showAllErrors = () => {
    blurHandler();
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueValid) {
      //sendFeedback();
      console.log("send?");
    } else {
      showAllErrors();
      console.log("error?");
    }
  };

  return (
    <MainLayout title={"Feedback"}>
      <form
        className={styles.MeetingFeedback}
        data-testid="MeetingFeedback"
        onSubmit={submitHandler}
      >
        We're always interested to read any feedback from our users!
        <BigTextInput
          id={"feedback"}
          label={"General Comments"}
          placeholder={"What did you think about using SkillShare?"}
          value={enteredValue}
          isValid={isInputValid}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        <Button icon="👑" type={"submit"} buttonStyle={"primary"}>
          Submit
        </Button>
      </form>
    </MainLayout>
  );
};

export default MeetingFeedback;
