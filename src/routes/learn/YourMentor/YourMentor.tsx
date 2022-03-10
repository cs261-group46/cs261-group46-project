import React, {
  FC,
  Fragment,
} from "react";
import { update } from "../../../api/api";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import styles from "./YourMentor.module.scss";
import { MentorType } from "../../../types/Mentor";
import Tag from "../../../components/UI/Tag/Tag";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import Button from "../../../components/UI/Button/Button";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

interface YourMentorProps {}

const YourMentor: FC<YourMentorProps> = () => {
  const { mentee_mentor = undefined, mentee_id = undefined } = UseVerifyUser<{
    mentee_mentor: MentorType | null | undefined;
    mentee_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.mentor",
      },
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
    ],
  });

  const terminateMentorshipHandler = async (menteeId: number) => {
    try {
      const body = {
        mentor: -1,
      };
      await update({
        entity: menteeId,
        resource: "mentees",
        body: body,
      });
    } catch (errors) {
      console.log(errors);
    }
  };

  return (
    <DashboardSubpageLayout title="Your Mentor">
      <div className={styles.YourMentor} data-testid="YourMentor">
        <Button href="/learn/past-mentors">Past Mentors</Button>
        {mentee_id && mentee_mentor ? (
          <ContentCard
            heading={`${mentee_mentor.user.first_name} ${mentee_mentor.user.last_name}`}
            sections={[
              {
                title: "About",
                content: mentee_mentor.about,
              },
              {
                title: "Email",
                icon: "✉️",
                content: mentee_mentor.user.email,
              },
              {
                title: "Department",
                content: mentee_mentor.user.department.name,
              },
              {
                title: "Mentorship Areas",
                className: styles.Skills,
                content: mentee_mentor.topics.map((topic) => (
                  <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
                )),
              },
            ]}
            buttons={[
              {
                buttonStyle: "primary",
                children: "Meetings",
                icon: "👥",
                href: `/meetings/${mentee_id}`,
              },
              {
                buttonStyle: "default",
                children: "Terminate Partnership",
                icon: "📈",
                onClick: terminateMentorshipHandler.bind(null, mentee_id),
              },
            ]}
          />
        ) : (
          <Fragment>
            {mentee_id === undefined && <LoadingSpinner />}
            {mentee_id === null && (
              <p>You don't have a mentor at the moment. </p>
            )}
          </Fragment>
        )}
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourMentor;
