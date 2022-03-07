import React, { FC, FormEventHandler } from "react";
import styles from "./MenteeFeedback.module.scss";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";

interface MenteeFeedbackProps {}

const MenteeFeedback: FC<MenteeFeedbackProps> = () => {
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
        className={styles.MenteeFeedback}
        data-testid="MenteeFeedback"
        onSubmit={submitHandler}
      >
        Please provide some feedback to this mentee.
        <BigTextInput
          id={"feedback"}
          label={"General Comments"}
          placeholder={"Did this mentee make good progress?"}
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

export default MenteeFeedback;
