import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { update } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";
import Title from "../../../components/UI/Title/Title";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { MenteeFeedbackType } from "../../../types/MenteeFeedback";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

interface GiveFeedbackToMenteeProps {}

const GiveFeedbackToMentee: FC<GiveFeedbackToMenteeProps> = () => {
  const { userId = null, mentor_feedback_given = [] } = UseVerifyUser<{
    userId: number | null | undefined;
    mentor_feedback_given: MenteeFeedbackType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentor.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentor.feedback_given",
      },
    ],
  });

  let { menteeId } = useParams();
  const [feedback, setFeedback] = useState<MenteeFeedbackType | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!menteeId) {
      navigate("/dashboard");
    }

    if (userId) {
      const id = parseInt(menteeId as string);
      const found_mentee = mentor_feedback_given.find(
        (feedback) => feedback.mentee.id === id
      );

      if (found_mentee) {
        setFeedback(found_mentee);
      } else {
        navigate("/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, menteeId, JSON.stringify(mentor_feedback_given), navigate]);

  const {
    enteredValue: enteredFeedback,
    changeHandler: feedbackChangeHandler,
    blurHandler: feedbackBlurHandler,
    isInputValid: feedbackInputValid,
    isValueValid: feedbackValueValid,
  } = useInput<string>("", (d) => d.length <= 1000);

  const {
    enteredValue: starsValue,
    changeHandler: starsChangeHandler,
    isInputValid: starsInputValid,
    isValueValid: starsValueValid,
    blurHandler: starsBlurHandler,
  } = useInput<number | undefined>(
    0,
    (value) => value !== undefined && value > 0 && value <= 5
  );

  const sendFeedbackData = async () => {
    try {
      const body = {
        score: starsValue,
        feedback: enteredFeedback,
        mentee_id: parseInt(menteeId as string),
      };

      await update({
        resource: "menteefeedbacks",
        body: body,
        entity: (feedback as MenteeFeedbackType).id,
      });
      navigate("/mentor/your-mentees");
    } catch (errors) {
      console.log(errors);
    }
  };

  function showErrors() {
    // this will also make errors show if needed
    feedbackBlurHandler();
    starsBlurHandler();
  }

  const submitHandler = () => {
    if (feedbackValueValid && starsValueValid) {
      // send off this event to the backend
      sendFeedbackData();
    } else {
      showErrors();
    }
  };

  return (
    <DashboardSubpageLayout title="Give Feedback to Past Mentee">
      {feedback ? (
        <>
          <Title
            text={`${feedback.mentee.user.first_name} ${feedback.mentee.user.last_name}`}
          />
          <BigTextInput
            id={"feedback"}
            label={"Feedback"}
            placeholder={"Please provide feedback on your past mentee"}
            value={enteredFeedback}
            isValid={feedbackInputValid}
            onChange={feedbackChangeHandler}
            onBlur={feedbackBlurHandler}
          />
          <StarPicker
            type={"interactive"}
            id={"stars"}
            label={"Mentee Rating"}
            value={starsValue}
            isValid={starsInputValid}
            onChange={starsChangeHandler}
            onBlur={starsBlurHandler}
            size={"100%"}
          />
          <Button onClick={submitHandler} buttonStyle={"primary"}>
            Submit
          </Button>
        </>
      ) : (
        <LoadingSpinner />
      )}
      <div data-testid="GiveFeedbackToMentee" />
    </DashboardSubpageLayout>
  );
};

export default GiveFeedbackToMentee;
