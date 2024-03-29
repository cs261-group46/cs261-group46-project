import React, { FC, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { store, update } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import Title from "../../../components/UI/Title/Title";
import useInput from "../../../hooks/UseInput/UseInput";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { MenteeType } from "../../../types/Mentee";
import { MentorFeedbackType } from "../../../types/MentorFeedback";
import styles from "./GiveFeedbackToMentor.module.scss";

interface GiveFeedbackToMentorProps {}

const GiveFeedbackToMentor: FC<GiveFeedbackToMentorProps> = () => {
  const { userId = null, mentee_feedback_given = [] } = UseVerifyUser<{
    userId: number | null;
    mentee_feedback_given: MentorFeedbackType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentee.feedback_given",
      },
    ],
  });

  const showMessage = UseSystemMessage();

  let { mentorId } = useParams();
  const [feedback, setFeedback] = useState<MentorFeedbackType | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!mentorId) {
      showMessage("error", "Unspecified mentor id.");
      navigate("/dashboard");
    }

    if (userId) {
      const id = parseInt(mentorId as string);
      const found_mentor = mentee_feedback_given.find(
        (feedback) => feedback.mentor.id === id
      );

      if (found_mentor) {
        setFeedback(found_mentor);
      } else {
        showMessage("error", "Mentor not found.");
        navigate("/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentee_feedback_given), mentorId, navigate, userId]);

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
        mentor_id: parseInt(mentorId as string),
      };

      await update({
        resource: "mentorfeedbacks",
        body: body,
        entity: (feedback as MentorFeedbackType).id,
      });
      showMessage("success", "Feedback sent successfully.");
      navigate("/learn/past-mentors");
    } catch (errors) {
      showMessage("error", errors);
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
      {feedback && (
        <>
          <Title
            text={`${feedback.mentor.user.first_name} ${feedback.mentor.user.last_name}`}
          />
          <BigTextInput
            id={"feedback"}
            label={"Feedback"}
            icon="💬"
            placeholder={"Were they able to provide good support?"}
            value={enteredFeedback}
            isValid={feedbackInputValid}
            onChange={feedbackChangeHandler}
            onBlur={feedbackBlurHandler}
          />
          <StarPicker
            type={"interactive"}
            id={"stars"}
            icon="⭐"
            label={"Mentor Rating"}
            value={starsValue}
            isValid={starsInputValid}
            onChange={starsChangeHandler}
            onBlur={starsBlurHandler}
            size={"100%"}
          />
          <Button icon="👑" onClick={submitHandler} buttonStyle={"primary"}>
            Submit
          </Button>
        </>
      )}
    </DashboardSubpageLayout>
  );
};

export default GiveFeedbackToMentor;
