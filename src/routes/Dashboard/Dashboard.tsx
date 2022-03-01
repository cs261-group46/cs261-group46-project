import React, { FC, useContext } from "react";
import styles from "./Dashboard.module.scss";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Title from "../../components/UI/Title/Title";
import UseVerifyAuth from "../../hooks/UseVerifyAuth/UseVerifyAuth";
import UserDataContext from "../../store/UserDataContext";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  UseVerifyAuth();
  const userDataCtx = useContext(UserDataContext);
  const isMentor = userDataCtx.isMentor;
  const isMentee = userDataCtx.isMentee;
  const isExpert = userDataCtx.isExpert;

  const logoutHandler = async () => {
    const response = await fetch("/api/auth/logout");
    const returnedData = await response.json();
    if (returnedData.successful) userDataCtx.setLoggedInStatus(false);
  };

  return (
    <MainLayout title={"Dashboard"}>
      <div className={styles.Section}>
        <Title text={"Welcome back!"} className={styles.Title} />
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

        <Button icon={"👋"} onClick={logoutHandler}>
          Logout
        </Button>
      </div>

      <div className={styles.Section}>
        <Title text={"Your Learning"} className={styles.Title} />

        {!isMentee && (
          <Button href={"/learn/find-mentor"} buttonStyle="primary" icon={"👨‍🏫"}>
            Find a mentor
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
      </div>
      <div className={styles.Section}>
        <Title text={"Your Mentoring"} className={styles.Title} />

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
      </div>
      <div className={styles.Section}>
        <Title text={"Your Expertise"} className={styles.Title} />

        {!isExpert && (
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
      </div>
      <div data-testid="Dashboard" />
    </MainLayout>
  );
};

export default Dashboard;
