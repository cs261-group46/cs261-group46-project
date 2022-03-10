import React, { FC, FormEventHandler } from "react";
import styles from "./SiteFeedback.module.scss";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import BigTextInput from "../../components/UI/FormInput/BigTextInput/BigTextInput";
import useInput from "../../hooks/UseInput/UseInput";
import Button from "../../components/UI/Button/Button";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";
import { store } from "../../api/api";
import { useNavigate } from "react-router-dom";
import UseSystemMessage from "../../hooks/UseSystemMessage/UseSystemMessage";

interface SiteFeedbackProps {}

const SiteFeedback: FC<SiteFeedbackProps> = () => {
  const { userId = null } = UseVerifyUser<{
    userId: number | null;
  }>({});

  const showMessage = UseSystemMessage();

  const {
    enteredValue,
    isInputValid,
    isValueValid,
    changeHandler,
    blurHandler,
  } = useInput("", (value) => value.length > 0 && value.length < 1000);

  const showAllErrors = () => {
    blurHandler();
  };

  const navigate = useNavigate();

  const sendFeedbackData = async () => {
    try {
      const body = {
        feedback: enteredValue,
        user_id: userId,
      };

      await store({
        resource: "applicationfeedbacks",
        body: body,
      });

      showMessage("success", "Feedback submitted successfully. Thank you!");
      navigate("/dashboard");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueValid) {
      sendFeedbackData();
    } else {
      showAllErrors();
    }
  };

  return (
    <MainLayout title={"Feedback"}>
      <form
        className={styles.SiteFeedback}
        data-testid="SiteFeedback"
        onSubmit={submitHandler}
      >
        We're always interested to read any feedback from our users!
        <BigTextInput
          id={"feedback"}
          label={"General Comments"}
          icon="💬"
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

export default SiteFeedback;
