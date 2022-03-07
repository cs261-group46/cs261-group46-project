import React, { FC, FormEventHandler, Fragment } from "react";
import styles from "./MentorFeedback.module.scss";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { MentorType } from "../../../types/Mentor";

interface MentorFeedbackProps {}

const MentorFeedback: FC<MentorFeedbackProps> = () => {
  const { mentee_mentor: mentor = null } = UseVerifyUser<{
    mentee_mentor: MentorType | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.mentor",
        redirectOnFail: "/dashboard",
      },
    ],
  });

  const {
    enteredValue: feedbackValue,
    isInputValid: isFeedbackInputValid,
    isValueValid: isFeedbackValueValid,
    changeHandler: feedbackChangeHandler,
    blurHandler: feedbackBlurHandler,
  } = useInput("", (value) => value.length > 0);

  const {
    enteredValue: starsValue,
    isInputValid: isStarsInputValid,
    isValueValid: isStarsValueValid,
    changeHandler: starsChangeHandler,
    blurHandler: starsBlurHandler,
  } = useInput<number | undefined>(undefined, (value) => value !== undefined);

  const showAllErrors = () => {
    feedbackBlurHandler();
    starsBlurHandler();
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isFeedbackValueValid && isStarsValueValid) {
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
        className={styles.MentorFeedback}
        data-testid="MentorFeedback"
        onSubmit={submitHandler}
      >
        {mentor && (
          <Fragment>
            Please enter your feedback for your time with{" "}
            {mentor.user.first_name}
            .
            <BigTextInput
              id={"feedback"}
              label={"General Comments"}
              placeholder={"Were they able to provide good support?"}
              value={feedbackValue}
              isValid={isFeedbackInputValid}
              onChange={feedbackChangeHandler}
              onBlur={feedbackBlurHandler}
            />
            <StarPicker
              type={"interactive"}
              id={"feedback"}
              label={"Rating"}
              value={starsValue}
              isValid={isStarsInputValid}
              onChange={starsChangeHandler}
              onBlur={starsBlurHandler}
            />
            <Button icon="👑" type={"submit"} buttonStyle={"primary"}>
              Submit
            </Button>
          </Fragment>
        )}
      </form>
    </MainLayout>
  );
};

export default MentorFeedback;
