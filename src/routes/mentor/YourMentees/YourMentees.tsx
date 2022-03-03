import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import styles from "./YourMentees.module.scss";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import UseLogin from "../../../hooks/UseLogin/UseLogin";
import Title from "../../../components/UI/Title/Title";
import MenteeCard from "./MenteeCard/MenteeCard";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import { get } from "../../../api/api";
import UserDataContext from "../../../store/UserDataContext";
import { MentorshipRequestType } from "../../../types/MentorshipRequest";

interface YourMenteeProps {}

const exampleMentees = [
  {
    firstname: "John",
    lastname: "Smith",
    completedGoal: 10,
    totalGoal: 10,
    id: 4,
  },
  {
    firstname: "Kai",
    lastname: "Smith",
    completedGoal: 2,
    totalGoal: 7,
    id: 5,
  },
  {
    firstname: "Amy",
    lastname: "Smith",
    completedGoal: 6,
    totalGoal: 10,
    id: 6,
  },
];

const YourMentees: FC<YourMenteeProps> = () => {
  UseVerifyAuth();
  const userDataCtx = useContext(UserDataContext);

  const [mentees, setMentees] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);

  const [pageVisiable, updatePageVisible] = useState(1)
  
  const getMentees = useCallback(async () => {
    try {
      const data = await get({
        resource: "users",
        entity: userDataCtx.userId as number,
        args: {
          fields: ["mentor.mentees", "mentor.mentorship_requests_received"],
        },
      });
      console.log(data);
      setMentees(data.user.mentor.mentees);
      setMentorshipRequests(data.user.mentor.mentorship_requests_received);
    } catch (error) {}
  }, [userDataCtx.userId]);

  useEffect(() => {
    getMentees();
  }, [getMentees]);

  //   const menteeNum = exampleMentees.length; //TODO: get from database

  //TODO: get list of mentees from database, and if they dont have any return a different message (systemmessage?)
  const menteeList = mentees.map((mentee) => (
    <MenteeCard
      key={mentee.id}
      firstname={mentee.firstname}
      lastname={mentee.lastname}
      id={mentee.id}
      completedGoal={mentee.completedGoal}
      totalGoal={mentee.totalGoal}
    />
  ));

  const mentorshipRequestsList = mentorshipRequests.map(
    (req: MentorshipRequestType) => (
      <MenteeCard
        key={req.user.id}
        firstname={req.user.first_name}
        lastname={req.user.last_name}
        id={req.id}
        completedGoal={20}
        totalGoal={100}
      />
    )
  );

  return (
    <MainLayout title="Your Mentees">
      <Title text={`Current Mentees: ${menteeList.length}`} />
      <div className={styles.YourMentees}>
        {menteeList.length === 0
          ? "You currently don't have any mentees"
          : menteeList}
      </div>
      <div data-testid="YourMentees" />
    </MainLayout>
  );
};

export default YourMentees;
