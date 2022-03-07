import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../api/api";
import UseVerifyAuth from "../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../store/UserDataContext";
import styles from "./YourProfile.module.scss";
import { MentorType } from "../../types/Mentor";
import Tag from "../../components/UI/Tag/Tag";
import ContentCard from "../../components/UI/ContentCard/ContentCard";
import { FullUserType } from "../../types/User";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";

interface YourProfileProps {}

const YourProfile: FC<YourProfileProps> = () => {
  const { userId = null, user = null } = UseVerifyUser<{
    userId: number | null | undefined;
    user: FullUserType | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "",
      },
    ],
  });

  console.log(user);

  return (
    <DashboardSubpageLayout title="Your Profile">
      <div className={styles.YourProfile} data-testid="YourProfile">
        {user && (
          <ContentCard
            heading={`${user.user.first_name} ${user.user.last_name}`}
            sections={[
              {
                title: "Email",
                icon: "✉️",
                content: user.user.email,
              },
              {
                title: "Department",
                content: user.user.department.name,
              },
              user.user.mentor && {
                title: "About your mentorship",
                content: user.user.mentor.about,
              },
              user.user.mentor && {
                title: "Mentorship Areas",
                className: styles.Tags,
                content: user.user.mentor.topics.map((topic) => (
                  <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
                )),
              },
              user.user.mentor && {
                title: "Capacity",
                content: user.user.mentor.capacity,
              },
              user.user.expert && {
                title: "Areas of Expertise",
                className: styles.Tags,
                content: user.user.expert.topics.map((topic) => (
                  <Tag key={topic.id}>{topic.name}</Tag>
                )),
              },
              user.user.mentee && {
                title: "Areas of Interests",
                className: styles.Tags,
                content: user.user.mentee.topics.map((topic) => (
                  <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
                )),
              },
              user.user.mentee && {
                title: "About you as a mentee",
                content: user.user.mentee.about,
              },
              user.user.mentee &&
                user.user.mentee.mentor && {
                  title: "Your Mentor",
                  content: `${user.user.mentee.mentor.user.first_name} ${user.user.mentee.mentor.user.last_name}`,
                },
            ]}
          />
        )}
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourProfile;
