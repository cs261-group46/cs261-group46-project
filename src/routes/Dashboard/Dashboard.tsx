import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Title from "../../components/UI/Title/Title";
import UseVerifyAuth from "../../hooks/UseVerifyAuth/UseVerifyAuth";
import UserDataContext from "../../store/UserDataContext";
import { get } from "../../api/api";
import { NotificationType } from "../../types/Notification";
import Notifications from "../../components/Notifications/Notifications";
import Icon from "../../components/UI/Icon/Icon";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  UseVerifyAuth();
  const userDataCtx = useContext(UserDataContext);
  const isMentor = userDataCtx.isMentor;
  const isMentee = userDataCtx.isMentee;
  const isExpert = userDataCtx.isExpert;

  const [notificationsLearn, setNotificationsLearn] = useState<
    NotificationType<"learning">[]
  >([]);

  const [notificationsMentor, setNotificationsMentor] = useState<
    NotificationType<"mentoring">[]
  >([]);

  const [notificationsExpert, setNotificationsExpert] = useState<
    NotificationType<"expertise">[]
  >([]);

  const [notificationsLearnVisible, setNotificationsLearnVisible] =
    useState<boolean>(false);
  const [notificationsMentorVisible, setNotificationsMentorVisible] =
    useState<boolean>(false);
  const [notificationsExpertVisible, setNotificationsExpertVisible] =
    useState<boolean>(false);

  const getNotifications = async () => {
    try {
      const data = await get({
        resource: "notifications",
        args: {
          fields: [
            "description",
            "notification_level",
            "notification_type",
            "solution",
          ],
        },
      });

      const mentorNotifications: NotificationType<"mentoring">[] = [];
      const learnNotifications: NotificationType<"learning">[] = [];
      const expertNotifcations: NotificationType<"expertise">[] = [];

      data.notifications.forEach(
        (
          notification: NotificationType<"learning" | "mentoring" | "expertise">
        ) => {
          if (notification.notification_type === "learning")
            learnNotifications.push(
              notification as NotificationType<"learning">
            );
          else if (notification.notification_type === "mentoring")
            mentorNotifications.push(
              notification as NotificationType<"mentoring">
            );
          else if (notification.notification_type === "expertise")
            expertNotifcations.push(
              notification as NotificationType<"expertise">
            );
        }
      );
      setNotificationsLearn(learnNotifications);
      setNotificationsMentor(mentorNotifications);
      setNotificationsExpert(expertNotifcations);
    } catch (errors) {}
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const logoutHandler = async () => {
    const response = await fetch("/api/auth/logout");
    const returnedData = await response.json();
    if (returnedData.successful) userDataCtx.setLoggedInStatus(false);
  };

  const toggleLearnNotificationHandler = () => {
    setNotificationsLearnVisible((prevState) => !prevState);
  };

  const toggleMentorNotificationHandler = () => {
    setNotificationsMentorVisible((prevState) => !prevState);
  };

  const toggleExpertNotificationHandler = () => {
    setNotificationsExpertVisible((prevState) => !prevState);
  };

  const removeLearnNotificationHandler = (
    notification: NotificationType<string>
  ) => {
    setNotificationsLearn((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== notification.id)
    );
  };

  const removeMentorNotificationHandler = (
    notification: NotificationType<string>
  ) => {
    setNotificationsMentor((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== notification.id)
    );
  };

  const removeExpertNotificationHandler = (
    notification: NotificationType<string>
  ) => {
    setNotificationsExpert((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== notification.id)
    );
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

        {/* <Button icon={"🔔"} href={"/notifications"}>
          All Notifications
        </Button> */}

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

        {notificationsLearn.length > 0 && (
          <>
            <Button
              className={styles.NotificationButton}
              buttonStyle="primary"
              icon={"🔔"}
              onClick={toggleLearnNotificationHandler}
            >
              Recent Notifications
              <div className={styles.NotificationCounter}>
                {notificationsMentor.length}
              </div>
              <Icon
                className={styles.NotificationButtonToggleIcon}
                icon={notificationsLearnVisible ? "🔼" : "🔽"}
              />
            </Button>
            {notificationsLearnVisible && (
              <Notifications
                onRemove={removeLearnNotificationHandler}
                notifications={notificationsLearn}
              />
            )}
          </>
        )}

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

        {isMentor && notificationsMentor.length > 0 && (
          <>
            <Button
              className={styles.NotificationButton}
              buttonStyle="primary"
              icon={"🔔"}
              onClick={toggleMentorNotificationHandler}
            >
              Recent Notifications
              <div className={styles.NotificationCounter}>
                {notificationsMentor.length}
              </div>
              <Icon
                className={styles.NotificationButtonToggleIcon}
                icon={notificationsMentorVisible ? "🔼" : "🔽"}
              />
            </Button>
            {notificationsMentorVisible && (
              <Notifications
                onRemove={removeMentorNotificationHandler}
                notifications={notificationsMentor}
              />
            )}
          </>
        )}

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

        {isExpert && notificationsExpert.length > 0 && (
          <>
            <Button
              className={styles.NotificationButton}
              buttonStyle="primary"
              icon={"🔔"}
              onClick={toggleExpertNotificationHandler}
            >
              Recent Notifications
              <div className={styles.NotificationCounter}>
                {notificationsMentor.length}
              </div>
              <Icon
                className={styles.NotificationButtonToggleIcon}
                icon={notificationsExpertVisible ? "🔼" : "🔽"}
              />
            </Button>
            {notificationsExpertVisible && (
              <Notifications
                onRemove={removeExpertNotificationHandler}
                notifications={notificationsExpert}
              />
            )}
          </>
        )}

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
