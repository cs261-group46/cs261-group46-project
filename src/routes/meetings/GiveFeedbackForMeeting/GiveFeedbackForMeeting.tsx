import React, { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import Title from "../../../components/UI/Title/Title";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { MeetingType } from "../../../types/Meeting";
import { UserType } from "../../../types/User";
import styles from "./GiveFeedbackForMeeting.module.scss";

interface GiveFeedbackForMeetingProps {}

const GiveFeedbackForMeeting: FC<GiveFeedbackForMeetingProps> = () => {
  const { userId = null, meetings_attending = [] } = UseVerifyUser<{
    userId: number | null;
    meetings_attending: MeetingType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "meetings_attending",
      },
    ],
  });

  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<MeetingType>();

  const verifyAttendance = useCallback(() => {
    if (!meetingId) {
      navigate("/calendar");
      return;
    }

    const meet = meetings_attending.find((m) => {
      console.log(m);

      return m.id === parseInt(meetingId);
    });
    console.log(meet);

    if (!meet) {
      navigate("/calendar");
      return;
    }

    const mDate = new Date(meet.date);
    const today = new Date();

    if (mDate.getTime() > today.getTime()) {
      navigate("/calendar");
      return;
    }

    console.log("date is bad");

    setMeeting(meet);
  }, [meetingId, JSON.stringify(meetings_attending), navigate]);

  useEffect(() => {
    if (userId) {
      verifyAttendance();
    }
  }, [verifyAttendance]);

  const {
    enteredValue: enteredFeedback,
    changeHandler: feedbackChangeHandler,
    blurHandler: feedbackBlurHandler,
    isInputValid: feedbackInputValid,
    isValueValid: feedbackValueValid,
  } = useInput<string>("", (d) => d.length <= 1000);

  const sendFeedbackData = async () => {
    try {
      const body = {
        feedback: enteredFeedback,
        user_id: userId,
        meeting_id: (meeting as MeetingType).id,
      };

      await store({
        resource: "meetingfeedbacks",
        body: body,
      });
      navigate("/calendar");
    } catch (errors) {
      console.log(errors);
    }
  };

  function showErrors() {
    // this will also make errors show if needed
    feedbackBlurHandler();
  }

  const submitHandler = () => {
    if (feedbackValueValid) {
      // send off this event to the backend
      sendFeedbackData();
    } else {
      showErrors();
    }
  };

  return (
    <DashboardSubpageLayout title="Give Feedback on the Meeting">
      {meeting && (
        <>
          <Title
            text={`${meeting.title} - ${(meeting.host as UserType).email}`}
          />

          <BigTextInput
            id={"feedback"}
            label={"Feedback"}
            placeholder={"Please provide feedback on the meeting"}
            value={enteredFeedback}
            isValid={feedbackInputValid}
            onChange={feedbackChangeHandler}
            onBlur={feedbackBlurHandler}
          />
          <Button onClick={submitHandler} buttonStyle={"primary"}>
            Submit
          </Button>
        </>
      )}
    </DashboardSubpageLayout>
  );
};

export default GiveFeedbackForMeeting;
