import React, { FC, useState } from "react";
import styles from "./YourMentees.module.scss";
import Title from "../../../components/UI/Title/Title";
import MenteeCard from "./MenteeCard/MenteeCard";
import { MentorshipRequestType } from "../../../types/MentorshipRequest";
import Button from "../../../components/UI/Button/Button";
import MentorshipRequestCard from "./MentorshipRequestCard/MentorshipRequestCard";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { MenteeType } from "../../../types/Mentee";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import PagePicker from "../../../components/UI/PagePicker/PagePicker";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import { MenteeFeedbackType } from "../../../types/MenteeFeedback";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import { update } from "../../../api/api";

interface YourMenteeProps {}

const YourMentees: FC<YourMenteeProps> = () => {
  const {
    userId = null,
    mentor_mentees: mentees = [],
    mentor_mentorship_requests_received: mentorshipRequests = [],
    mentor_feedback_given = [],
    stateChangingHandler,
  } = UseVerifyUser<{
    userId: number | null | undefined;
    mentor_id: number | null | undefined;
    mentor_mentees: MenteeType[] | [];
    mentor_mentorship_requests_received: MentorshipRequestType[] | [];
    mentor_feedback_given: MenteeFeedbackType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentor.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentor.mentees",
      },
      {
        dataPoint: "mentor.mentorship_requests_received",
      },
      {
        dataPoint: "mentor.feedback_given",
      },
    ],
  });

  const [filterEvents, setFilterEvents] = useState<number>(0);
  const showMessage = UseSystemMessage();

  const processRequestHandler = async (
    mentorshipRequest: MentorshipRequestType,
    accept: boolean
  ) => {
    const body = {
      accepted: accept,
    };
    try {
      await update({
        resource: "mentorshiprequests",
        entity: mentorshipRequest.id,
        body: body,
      });

      stateChangingHandler((prevState) => ({
        ...prevState,
        mentor_mentorship_requests_received:
          prevState.mentor_mentorship_requests_received.filter(
            (m) => m.id !== mentorshipRequest.id
          ),
      }));

      if (accept) {
        showMessage("success", "Request accepted successfully");

        stateChangingHandler((prevState) => {
          const mentor_mentees = [
            ...prevState.mentor_mentees,
            mentorshipRequest.mentee,
          ];

          return {
            ...prevState,
            mentor_mentees: mentor_mentees,
          };
        });
      } else showMessage("success", "Request rejected successfully");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const terminateMentorshipHandler = async (mentee: MenteeType) => {
    try {
      const body = {
        mentor: -1,
      };
      await update({
        entity: mentee.id,
        resource: "mentees",
        body: body,
      });
      stateChangingHandler((prevState) => ({
        ...prevState,
        mentor_mentees: prevState.mentor_mentees.filter(
          (m) => m.id !== mentee.id
        ),
      }));
      showMessage("success", "Mentorship terminated successfully");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const menteeList = mentees?.map((mentee) => (
    <MenteeCard
      key={mentee.id}
      mentee={mentee}
      onTerminateMentorship={terminateMentorshipHandler}
    />
  ));

  const mentorshipRequestsList = mentorshipRequests?.map((req) => (
    <MentorshipRequestCard
      key={req.mentee.id}
      mentorshipRequest={req}
      onProcessRequest={processRequestHandler}
    />
  ));

  const pastMenteesList = mentor_feedback_given.map(
    (feedback: MenteeFeedbackType, index: number) => (
      <ContentCard
        key={index}
        heading={`${feedback.mentee.user.first_name} ${feedback.mentee.user.last_name}`}
        sections={[
          {
            title: "Email",
            content: feedback.mentee.user.email,
          },
          {
            title: "Department",
            content: feedback.mentee.user.department.name,
          },
          feedback.feedback !== null && {
            title: "Feedback given",
            content: feedback.feedback,
          },
          feedback.score !== null && {
            title: "Score given",
            content: (
              <StarPicker type="inline" value={feedback.score} size={"30px"} />
            ),
          },
        ]}
        buttons={[
          feedback.feedback === null && {
            children: "Give Feedback",
            buttonStyle: "primary",
            href: `/mentor/past-mentees/give-feedback/${feedback.mentee.id}`,
          },
        ]}
      />
    )
  );

  return (
    <DashboardSubpageLayout
      title="Your Mentees"
      dashboardSection={"#mentoring"}
    >
      <PagePicker
        pickers={[
          {
            onClick: () => setFilterEvents(0),
            text: "Mentees",
            selected: filterEvents === 0,
          },
          {
            onClick: () => setFilterEvents(1),
            text: "Requests",
            selected: filterEvents === 1,
            highlighted: mentorshipRequests.length > 0,
          },
          {
            onClick: () => setFilterEvents(2),
            text: "Past Mentees",
            selected: filterEvents === 2,
          },
        ]}
        buttons={{
          buttonLeft: () => {
            setFilterEvents((prev) => (prev > 0 ? prev - 1 : prev));
          },
          buttonRight: () => {
            setFilterEvents((prev) => (prev < 2 ? prev + 1 : prev));
          },
        }}
      />

      {filterEvents === 0 && (
        <>
          <div className={styles.YourMentees}>
            {menteeList ? (
              menteeList.length === 0 ? (
                "You currently don't have any mentees"
              ) : (
                <>
                  <Title text={`No. of Mentees: ${menteeList.length}`} />
                  {menteeList}
                </>
              )
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </>
      )}

      {filterEvents === 1 && (
        <>
          <div className={styles.YourMentees}>
            {mentorshipRequestsList ? (
              mentorshipRequestsList.length === 0 ? (
                "You currently don't have any mentorship requests"
              ) : (
                <>
                  <Title
                    text={`No. of Mentorship Requests : ${mentorshipRequestsList.length}`}
                  />
                  {mentorshipRequestsList}
                </>
              )
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </>
      )}
      {filterEvents === 2 && (
        <>
          <div className={styles.YourMentees}>
            {mentor_feedback_given.length === 0 ? (
              "You currently don't have any past mentees"
            ) : (
              <>
                <Title
                  text={`No. of Past Mentees : ${mentor_feedback_given.length}`}
                />
                {pastMenteesList}
              </>
            )}
          </div>
        </>
      )}

      <div data-testid="YourMentees" />
    </DashboardSubpageLayout>
  );
};

export default YourMentees;
