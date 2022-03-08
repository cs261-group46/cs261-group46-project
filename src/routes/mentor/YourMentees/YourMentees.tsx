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
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

interface YourMenteeProps {}

type Verifier = {
  userId: number | null | undefined;
  mentor_id: number | null | undefined;
  mentor_mentees: MenteeType[] | [];
  mentor_mentorship_requests_received: MentorshipRequestType[] | [];
};

const YourMentees: FC<YourMenteeProps> = () => {
  const {
    userId = null,
    mentor_mentees: mentees = undefined,
    mentor_mentorship_requests_received: mentorshipRequests = undefined,
  } = UseVerifyUser<Verifier>({
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
    ],
  });

  const [filterEvents, setFilterEvents] = useState<number>(0);

  const menteeList = mentees?.map((mentee) => (
    <MenteeCard key={mentee.id} mentee={mentee} />
  ));

  const mentorshipRequestsList = mentorshipRequests?.map((req) => (
    <MentorshipRequestCard key={req.mentee.id} mentorshipRequest={req} />
  ));

  return (
    <DashboardSubpageLayout title="Your Mentees">
      <div className={styles.buttonDiv}>
        <Button
          className={styles.firstButton}
          onClick={() => {
            setFilterEvents(0);
          }}
          buttonStyle={(filterEvents === 0 && "primary") || "default"}
        >
          Mentees
        </Button>
        <Button
          className={styles.lastButton}
          onClick={() => {
            setFilterEvents(1);
          }}
          buttonStyle={(filterEvents === 1 && "primary") || "default"}
        >
          Requests
        </Button>
      </div>

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

      <div data-testid="YourMentees" />
    </DashboardSubpageLayout>
  );
};

export default YourMentees;
