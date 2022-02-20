import React, { FC } from "react";
// import styles from "./Dashboard.module.scss";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Title from "../../components/UI/Title/Title";
import {useNavigate} from "react-router-dom";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  const isMentor = false;
  const isMentee = false;
  const isExpert = false;

  const navigate = useNavigate();

  const logout = async () => {
      const response = await fetch("/api/user/logout", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
          },
      });

      const returnedData = await response.json();

      console.log(returnedData);

      if (response.ok) {
          navigate("/");
      } else {
          // setError(true);
      }
  };

  return (
    <MainLayout title={"Dashboard"}>
      <Title text={"Welcome back!"} />

      <Button icon={"👤"} href={"/profile"}>
        <p style={{ textDecoration: "none", display: "inline-block" }}>
          Your Profile
        </p>
      </Button>

      <Button icon={"🔔"} href={"/notifications"}>
        All Notifications
      </Button>

      <Button icon={"📅"} href={"/calendar"}>
        Upcoming Events
      </Button>

      <Button icon={"💬"} href={"/calendar"}>
        Messages
      </Button>

      <Button icon={"⚙️"} href={"/settings"}>
        Settings
      </Button>

      <Button icon={"👋"} onClick={logout}>Logout</Button>

      <Title text={"Your Learning"} />

      {!isMentee && (
        <Button href={"/learn/become-mentee"} buttonStyle="primary" icon={"👨‍🏫"}>
          Get a mentor
        </Button>
      )}

      <Button icon={"🔔"}>Recent Notifications</Button>

      {isMentee && (
        <Button href={"/learn/your-mentor"} icon={"👨‍🏫"}>
          Your Mentor
        </Button>
      )}

      {isMentee && (
        <Button href={"/learn/plans-of-action"} icon={"📈"}>
          Plans of Action
        </Button>
      )}

      <Button href={"/learn/workshops"} icon={"✏️"}>
        Workshops
      </Button>

      <Button href={"/learn/group-sessions"} icon={"👥"}>
        Group Sessions
      </Button>

      <Button href={"/learn/interests"} icon={"💡"}>
        Your Interests
      </Button>

      <Title text={"Your Mentoring"} />

      {!isMentor && (
        <Button
          href={"/mentor/become-mentor"}
          buttonStyle="primary"
          icon={"👨‍🏫"}
        >
          Become a Mentor
        </Button>
      )}

      {isMentor && <Button icon={"🔔"}>Recent Notifications</Button>}

      {isMentor && (
        <Button href={"/mentor/your-mentees"} icon={"🧑‍🎓"}>
          Your Mentees
        </Button>
      )}

      {isMentor && (
        <Button href={"/mentor/skills"} icon={"💪"}>
          Your Skills
        </Button>
      )}

      <Title text={"Your Expertise"} />

      {!isMentor && (
        <Button
          href={"/expert/become-expert"}
          buttonStyle="primary"
          icon={"👨‍🏫"}
        >
          Become an Expert
        </Button>
      )}

      {isExpert && <Button icon={"🔔"}>Recent Notifications</Button>}

      {isExpert && (
        <Button href={"/expert/workshops"} icon={"✏"}>
          Your Workshops
        </Button>
      )}
      {isExpert && (
        <Button href={"/expert/skills"} icon={"💪"}>
          Your Fields of Expertise
        </Button>
      )}

      <div data-testid="Dashboard" />
    </MainLayout>
  );
};

export default Dashboard;
