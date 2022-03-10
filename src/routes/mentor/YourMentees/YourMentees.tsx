import React, { FC, useState } from "react";
import styles from "./YourMentees.module.scss";
import Title from "../../../components/UI/Title/Title";
import MenteeCard from "./MenteeCard/MenteeCard";
import { MentorshipRequestType } from "../../../types/MentorshipRequest";
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

interface YourMenteeProps {}

const YourMentees: FC<YourMenteeProps> = () => {
  const {
    // userId,
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

  const menteeList = mentees?.map((mentee) => (
    <MenteeCard
      key={mentee.id}
      mentee={mentee}
      stateChangingHandler={stateChangingHandler}
    />
  ));

  const mentorshipRequestsList = mentorshipRequests?.map((req) => (
    <MentorshipRequestCard
      key={req.mentee.id}
      mentorshipRequest={req}
      stateChangingHandler={stateChangingHandler}
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
    <DashboardSubpageLayout title="Your Mentees">
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
