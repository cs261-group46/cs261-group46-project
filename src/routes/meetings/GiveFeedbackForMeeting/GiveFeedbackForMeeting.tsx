import React, { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import Title from "../../../components/UI/Title/Title";
import useInput from "../../../hooks/UseInput/UseInput";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { MeetingType } from "../../../types/Meeting";
import { UserType } from "../../../types/User";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

interface GiveFeedbackForMeetingProps {}

const GiveFeedbackForMeeting: FC<GiveFeedbackForMeetingProps> = () => {
  const {
    userId = null,
    meetings_attending = [],
    meetings_hosted = [],
  } = UseVerifyUser<{
    userId: number | null;
    meetings_attending: MeetingType[] | [];
    meetings_hosted: MeetingType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "meetings_attending",
      },
      {
        dataPoint: "meetings_hosted",
      },
    ],
  });
  const showMessage = UseSystemMessage();

  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<MeetingType>();

  const verifyAttendance = useCallback(() => {
    if (!meetingId) {
      showMessage("error", "Unspecified meeting id.");
      navigate("/calendar");
      return;
    }

    const meet = meetings_attending.find((m) => m.id === parseInt(meetingId));
    const meet_host = meetings_hosted.find(
      (m) =>
        m.id === parseInt(meetingId) && m.meeting_type === "one on one meeting"
    );

    if (!meet && !meet_host) {
      showMessage(
        "error",
        "You cannot give feedback on meetings you did not attend."
      );
      navigate("/calendar");
      return;
    }

    const m = meet !== undefined ? meet : meet_host;

    const mDate = new Date((m as MeetingType).date);
    const today = new Date();

    if (mDate.getTime() > today.getTime()) {
      showMessage(
        "error",
        "You cannot give feedback on meetings which did not yet happen."
      );

      navigate("/calendar");
      return;
    }

    setMeeting(m as MeetingType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    meetingId,
    JSON.stringify(meetings_attending),
    JSON.stringify(meetings_hosted),
    navigate,
    showMessage,
  ]);

  useEffect(() => {
    if (userId) {
      verifyAttendance();
    }
  }, [userId, verifyAttendance]);

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
      showMessage("success", "Feedback submitted successfully.");
      navigate("/calendar");
    } catch (errors) {
      showMessage("error", errors);
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
      {meeting ? (
        <>
          <Title
            text={`${meeting.title} - ${
              meeting.host ? (meeting.host as UserType).first_name : "You"
            } ${meeting.host ? (meeting.host as UserType).last_name : ""}`}
          />

          <BigTextInput
            id={"feedback"}
            label={"Feedback"}
            icon="💬"
            placeholder={"Please provide feedback on the meeting"}
            value={enteredFeedback}
            isValid={feedbackInputValid}
            onChange={feedbackChangeHandler}
            onBlur={feedbackBlurHandler}
          />
          <Button icon="👑" onClick={submitHandler} buttonStyle={"primary"}>
            Submit
          </Button>
        </>
      ) : (
        <LoadingSpinner />
      )}
      <div data-testid="GiveFeedbackForMeeting" />
    </DashboardSubpageLayout>
  );
};

export default GiveFeedbackForMeeting;
