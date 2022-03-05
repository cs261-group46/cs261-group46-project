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
import { FullUserType } from "../../types/UserType";

interface YourProfileProps {}

const YourProfile: FC<YourProfileProps> = () => {
  const navigate = useNavigate();
  const userDataCtx = useContext(UserDataContext);
  const [user, updateUser] = useState<FullUserType>();

  useEffect(() => {
    if (!userDataCtx.menteeId) {
      navigate("/dashboard");
    }
  }, [navigate, userDataCtx.menteeId]);

  const getMentor = useCallback(async () => {
    try {
      const data = await get({
        resource: "users",
        entity: userDataCtx.userId as number,
        args: {
          fields: [
            "id",
            "first_name",
            "last_name",
            "email",
            "department",
            "mentor.topics",
            "mentor.capacity",
            "mentor.score",
            "mentor.about",
            "mentee.topics",
            "mentee.about",
            "expert",
            "mentee.mentor.first_name",
            "mentee.mentor.last_name",
          ],
        },
      });

      console.log(data);

      updateUser(data.user);
    } catch (errors) {
      console.log(errors);
    }
  }, [userDataCtx.userId]);

  useEffect(() => {
    getMentor();
  }, [getMentor]);

  return (
    <DashboardSubpageLayout title="Your Profile">
      <div className={styles.YourProfile} data-testid="YourProfile">
        {user && (
          <ContentCard
            heading={`${user.first_name} ${user.last_name}`}
            sections={[
              {
                title: "Email",
                icon: "✉️",
                content: user.email,
              },
              {
                title: "Department",
                content: user.department.name,
              },
              user.mentor && {
                title: "Mentor-About",
                content: user.mentor.about,
              },
              user.mentor && {
                title: "Mentorship Areas",
                className: styles.Tags,
                content: user.mentor.topics.map((topic) => (
                  <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
                )),
              },
              user.mentor && {
                title: "Capacity",
                content: user.mentor.capacity,
              },
              user.expert && {
                title: "Areas of Expertise",
                className: styles.Tags,
                content: user.expert.topics.map((topic) => (
                  <Tag key={topic.id}>{topic.name}</Tag>
                )),
              },
              user.mentee && {
                title: "Areas of Interests",
                className: styles.Tags,
                content: user.mentee.topics.map((topic) => (
                  <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
                )),
              },
              user.mentee && {
                title: "Mentee-About",
                content: user.mentee.about,
              },
              user.mentee &&
                user.mentee.mentor && {
                  title: "Your Mentor",
                  content: `${user.mentee.mentor.first_name} ${user.mentee.mentor.last_name}`,
                },
            ]}
          />
        )}
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourProfile;
