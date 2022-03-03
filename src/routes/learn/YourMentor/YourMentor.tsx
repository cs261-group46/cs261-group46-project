import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../../api/api";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import styles from "./YourMentor.module.scss";
import { MentorType } from "../../../types/Mentor";
import Tag from "../../../components/UI/Tag/Tag";

interface YourMentorProps {}

const YourMentor: FC<YourMentorProps> = () => {
  UseVerifyAuth();
  const navigate = useNavigate();
  const userDataCtx = useContext(UserDataContext);
  const [mentor, updateMentor] = useState<MentorType>();

  useEffect(() => {
    if (!userDataCtx.menteeId) {
      navigate("/dashboard");
    }
  }, [navigate, userDataCtx.menteeId]);

  const getMentor = useCallback(async () => {
    try {
      const data = await get({
        resource: "mentees",
        entity: userDataCtx.menteeId as number,
      });

      updateMentor(data.mentee.mentor);
    } catch (errors) {
      console.log(errors);
    }
  }, [userDataCtx.menteeId]);

  useEffect(() => {
    getMentor();
  }, [getMentor]);

  return (
    <DashboardSubpageLayout title="Your Mentor">
      <div className={styles.YourMentor} data-testid="YourMentor">
        {mentor && <p>{mentor.user.first_name}</p>}
        {mentor && <p>{mentor.user.last_name}</p>}
        {mentor && <p>{mentor.user.email}</p>}
        {mentor && <p>{mentor.user.department.name}</p>}
        {mentor && <p>{mentor.id}</p>}

        {mentor &&
          mentor.topics.map((topic) => (
            <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
          ))}
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourMentor;
