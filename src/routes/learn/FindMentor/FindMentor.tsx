import React, { FC, useEffect, useState } from "react";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { index, store } from "../../../api/api";
import { MentorType } from "../../../types/Mentor";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import styles from "./FindMentor.module.scss";
import Tag from "../../../components/UI/Tag/Tag";

interface FindMentorProps {}

const FindMentor: FC<FindMentorProps> = () => {
  const { mentee_id = null } = UseVerifyUser<{
    mentee_id: number | null;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentee.mentor.id",
        redirectOnSuccess: "/dashboard",
      },
    ],
  });

  const [mentors, setMentors] = useState<MentorType[]>([]);

  const indexMentors = async () => {
    try {
      const data = await index({
        resource: "mentors",
        args: {
          fields: [
            "id",
            "about",
            "topics.topic",
            "user.first_name",
            "user.last_name",
            "user.department",
            "user.email",
          ],
          filters: ["suitable"],
        },
      });

      setMentors(data.mentors);
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    indexMentors();
  }, []);

  const requestMentorHandler = async (mentorId: number) => {
    try {
      const body = {
        mentee: mentee_id,
        mentor: mentorId,
      };

      await store({
        resource: "mentorshiprequests",
        body: body,
      });
    } catch (errors) {
      console.log(errors);
    }
  };

  const mentorCards = mentors.map((mentor) => (
    // <MentorCard key={mentor.id} mentor={mentor} />
    <ContentCard
      heading={`${mentor.user.first_name} ${mentor.user.last_name}`}
      sections={[
        {
          title: "Email",
          content: mentor.user.email,
        },
        {
          title: "About",
          content: mentor.about,
        },
        {
          className: styles.tags,
          title: "Skills",
          content: mentor.topics.map((topic) => (
            <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
          )),
        },
        {
          className: styles.tags,
          title: "Department",
          content: mentor.user.department.name,
        },
      ]}
      buttons={[
        {
          children: "Request Mentorship",
          buttonStyle: "primary",
          onClick: requestMentorHandler.bind(null, mentor.id),
        },
      ]}
    />
  ));

  return (
    <DashboardSubpageLayout title="Find a Mentor">
      <div className={styles.FindMentor} data-testid="FindMentor">
        {mentorCards}
        {mentorCards.length === 0 &&
          "Sorry, couldn't find any available mentors"}
      </div>
    </DashboardSubpageLayout>
  );
};

export default FindMentor;
