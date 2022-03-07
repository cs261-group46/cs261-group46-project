import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../../api/api";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import styles from "./YourMentor.module.scss";
import { MentorType } from "../../../types/Mentor";
import Tag from "../../../components/UI/Tag/Tag";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";

interface YourMentorProps {}

const YourMentor: FC<YourMentorProps> = () => {
  // const navigate = useNavigate();
  // const userDataCtx = useContext(UserDataContext);
  // const [mentor, updateMentor] = useState<MentorType>();

  // useEffect(() => {
  //   if (!userDataCtx.menteeId) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate, userDataCtx.menteeId]);

  // const getMentor = useCallback(async () => {
  //   try {
  //     const data = await get({
  //       resource: "users",
  //       entity: userDataCtx.userId as number,
  //       args: {
  //         fields: ["mentee.mentor"],
  //       },
  //     });

  //     console.log(data);

  //     updateMentor(data.user.mentee.mentor);
  //   } catch (errors) {
  //     console.log(errors);
  //   }
  // }, [userDataCtx.menteeId]);

  // useEffect(() => {
  //   getMentor();
  // }, [getMentor]);

  const { mentee_mentor: mentor = null, mentee_id = null } = UseVerifyUser<{
    mentee_mentor: MentorType | null | undefined;
    mentee_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.mentor",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
    ],
  });

  return (
    <DashboardSubpageLayout title="Your Mentor">
      <div className={styles.YourMentor} data-testid="YourMentor">
        {mentor && mentee_id && (
          <ContentCard
            heading={`${mentor.user.first_name} ${mentor.user.last_name}`}
            sections={[
              {
                title: "About",
                content: mentor.about,
              },
              {
                title: "Email",
                icon: "✉️",
                content: mentor.user.email,
              },
              {
                title: "Department",
                content: mentor.user.department.name,
              },
              {
                title: "Mentorship Areas",
                className: styles.Skills,
                content: mentor.topics.map((topic) => (
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
            ]}
          />
        )}

        {/* {mentor && <p>{mentor.user.first_name}</p>}
        {mentor && <p>{mentor.user.last_name}</p>}
        {mentor && <p>{mentor.user.email}</p>}
        {mentor && <p>{mentor.user.department.name}</p>}
        {mentor && <p>{mentor.id}</p>} */}

        {/* {mentor &&
          mentor.topics.map((topic) => (
            <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
          ))} */}
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourMentor;
