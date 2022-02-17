import React, { FC, Fragment } from "react";
import styles from "./Dashboard.module.scss";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Title from "../../components/UI/Title/Title";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  const isMentor = false;
  const isMentee = false;
  const isExpert = false;

  return (
    <MainLayout title={"Dashboard"}>
      <Title text={"Welcome back!"} />

      <Button icon={"👤"} href={"/profile"} onClick={() => {}}>
        <p style={{ textDecoration: "none", display: "inline-block" }}>
          Your Profile
        </p>
      </Button>

      <Button icon={"🔔"} onClick={() => {}}>
        All Notifications
      </Button>

      <Button icon={"📅"} href={"/workshops"} onClick={() => {}}>
        Upcoming Events
      </Button>

      <Button icon={"💬"} onClick={() => {}}>
        Messages
      </Button>

      <Button icon={"⚙️"} href={"/settings"} onClick={() => {}}>
        Settings
      </Button>

      <Button icon={"👋"} onClick={() => {}}>
        Logout
      </Button>

      <Title text={"Your Learning"} />

      {!isMentee && (
        <Button
          href={"/learn/become-mentee"}
          buttonStyle="primary"
          icon={"👨‍🏫"}
          onClick={() => {}}
        >
          Get a mentor
        </Button>
      )}

      <Button icon={"🔔"} onClick={() => {}}>
        Recent Notifications
      </Button>

      {isMentee && (
        <Button href={"/learn/your-mentor"} icon={"👨‍🏫"} onClick={() => {}}>
          Your Mentor
        </Button>
      )}

      {isMentee && (
        <Button href={"/learn/plans-of-action"} icon={"📈"} onClick={() => {}}>
          Plans of Action
        </Button>
      )}

      <Button href={"/learn/workshops"} icon={"✏️"} onClick={() => {}}>
        Workshops
      </Button>

      <Button href={"/learn/group-sessions"} icon={"👥"} onClick={() => {}}>
        Group Sessions
      </Button>

      <Button href={"/learn/interests"} icon={"💡"} onClick={() => {}}>
        Your Interests
      </Button>

      <Title text={"Your Mentoring"} />

      {!isMentor && (
        <Button
          href={"/mentor/become-mentor"}
          buttonStyle="primary"
          icon={"👨‍🏫"}
          onClick={() => {}}
        >
          Become a Mentor
        </Button>
      )}

      {isMentor && (
        <Button icon={"🔔"} onClick={() => {}}>
          Recent Notifications
        </Button>
      )}

      {isMentor && (
        <Button href={"/mentor/your-mentees"} icon={"🧑‍🎓"} onClick={() => {}}>
          Your Mentees
        </Button>
      )}

      {isMentor && (
        <Button href={"/mentor/skills"} icon={"💪"} onClick={() => {}}>
          Your Skills
        </Button>
      )}

      <Title text={"Your Expertise"} />

      {!isMentor && (
        <Button
          href={"/expert/become-expert"}
          buttonStyle="primary"
          icon={"👨‍🏫"}
          onClick={() => {}}
        >
          Become an Expert
        </Button>
      )}

      {isExpert && (
        <Button icon={"🔔"} onClick={() => {}}>
          Recent Notifications
        </Button>
      )}

      {isExpert && (
        <Button href={"/expert/workshops"} icon={"✏"} onClick={() => {}}>
          Your Workshops
        </Button>
      )}
      {isExpert && (
        <Button href={"/expert/skills"} icon={"💪"} onClick={() => {}}>
          Your Fields of Expertise
        </Button>
      )}

      <div data-testid="Dashboard" />
    </MainLayout>
  );
};

export default Dashboard;
