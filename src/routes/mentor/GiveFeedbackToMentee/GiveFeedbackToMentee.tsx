import React, { FC, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { store, update } from "../../../api/api";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import Title from "../../../components/UI/Title/Title";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { MenteeType } from "../../../types/Mentee";
import { MenteeFeedbackType } from "../../../types/MenteeFeedback";
import styles from "./GiveFeedbackToMentee.module.scss";

interface GiveFeedbackToMenteeProps {}

const GiveFeedbackToMentee: FC<GiveFeedbackToMenteeProps> = () => {
  const {
    userId = null,
    mentee_id = null,
    mentor_id = null,
    mentor_feedback_given = [],
    mentor = null,
  } = UseVerifyUser<{
    userId: number | null | undefined;
    mentee_id: number | null | undefined;
    mentor_id: number | null | undefined;
    mentor_feedback_given: MenteeFeedbackType[] | [];
    mentor: any | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
      },
      {
        dataPoint: "mentor.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentor.feedback_given",
      },
      {
        dataPoint: "mentor",
      },
    ],
  });

  let { menteeId } = useParams();
  const [feedback, setFeedback] = useState<MenteeFeedbackType | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(mentor);

    if (menteeId && userId) {
      const id = parseInt(menteeId);
      const found_mentee = mentor_feedback_given.find((feedback) => {
        console.log("one of these should be found");
        console.log(feedback.mentee.id === id);

        return feedback.mentee.id === id;
      });

      console.log(found_mentee);
      console.log(mentor_feedback_given);
      console.log(id);

      if (found_mentee) {
        setFeedback(found_mentee);
      } else {
        console.log("navigating here");

        navigate("/dashboard");
      }
    }
  }, [userId, menteeId, JSON.stringify(mentor_feedback_given), navigate]);

  const {
    enteredValue: enteredFeedback,
    changeHandler: feedbackChangeHandler,
    blurHandler: feedbackBlurHandler,
    isInputValid: feedbackInputValid,
    isValueValid: feedbackValueValid,
  } = useInput<string>("", (d) => d.length < 1000);

  const {
    enteredValue: starsValue,
    changeHandler: starsChangeHandler,
    isInputValid: starsInputValid,
    isValueValid: starsValueValid,
    blurHandler: starsBlurHandler,
  } = useInput<number | undefined>(2, (value) => value !== undefined);

  const sendFeedbackData = async () => {
    try {
      const body = {};

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
      {feedback && (
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
          />
        </>
      )}
    </DashboardSubpageLayout>
  );
};

export default GiveFeedbackToMentee;
