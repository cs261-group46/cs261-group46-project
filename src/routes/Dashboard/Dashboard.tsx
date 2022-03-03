import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Title from "../../components/UI/Title/Title";
import UseVerifyAuth from "../../hooks/UseVerifyAuth/UseVerifyAuth";
import UserDataContext from "../../store/UserDataContext";
import { custom, get } from "../../api/api";
import { NotificationType } from "../../types/Notification";
import Notifications from "../../components/Notifications/Notifications";
import Icon from "../../components/UI/Icon/Icon";
import { useNavigate } from "react-router-dom";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  UseVerifyAuth();

  const [pageVisiable, setPageVisible] = useState(1);
  const navigate = useNavigate();

  const userDataCtx = useContext(UserDataContext);
  const userId = userDataCtx.userId;
  const isMentor = !!userDataCtx.mentorId;
  const isMentee = !!userDataCtx.menteeId;
  const isExpert = !!userDataCtx.expertId;

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

  const getNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await get({
        resource: "users",
        entity: userId as number,
        args: {
          fields: ["notifications"],
        },
      });

      console.log(data.user.notifications);

      const mentorNotifications: NotificationType<"mentoring">[] = [];
      const learnNotifications: NotificationType<"learning">[] = [];
      const expertNotifcations: NotificationType<"expertise">[] = [];

      data.user.notifications.forEach(
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
  }, [userId]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const logoutHandler = async () => {
    try {
      await custom({
        endpoint: "/auth/logout",
        method: "GET",
      });
      userDataCtx.updateUserId();
      navigate("/login");
    } catch (errors) {}
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
      {pageVisiable === 1 && (
        <div className={styles.Section}>
          <Title text={"Welcome back!"} className={styles.Title} />

          <Button icon={"👤"} href={"/profile"}>
            Your Profile
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
      )}

      {pageVisiable === 2 && (
        <div className={styles.Section}>
          <Title text={"Your Learning"} className={styles.Title} />

          {!isMentee && (
            <Button
              href={"/learn/find-mentor"}
              buttonStyle="primary"
              icon={"👨‍🏫"}
            >
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

          {/* <Button href={"/learn/workshops"} icon={"✏️"}>
          Workshops
        </Button> */}

          <Button href={"/learn/group-sessions"} icon={"👥"}>
            Explore Group Sessions
          </Button>

          <Button href={"/learn/interests"} icon={"💡"}>
            Your Interests
          </Button>
        </div>
      )}

      {pageVisiable === 3 && (
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
      )}

      {pageVisiable === 4 && (
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
      )}
      <div className={styles.Switch}>
        <Button
          onClick={setPageVisible.bind(null, 1)}
          className={`${styles.Button} ${
            pageVisiable === 1 && styles.selected
          }`}
          icon="🏠"
        >
          Home
        </Button>
        <Button
          onClick={setPageVisible.bind(null, 2)}
          className={`${styles.Button} ${
            pageVisiable === 2 && styles.selected
          }`}
          icon="🧑‍🎓"
        >
          Your Learning
        </Button>
        <Button
          onClick={setPageVisible.bind(null, 3)}
          className={`${styles.Button} ${
            pageVisiable === 3 && styles.selected
          }`}
          icon="🧑"
        >
          Your Mentoring
        </Button>
        <Button
          onClick={setPageVisible.bind(null, 4)}
          className={`${styles.Button} ${
            pageVisiable === 4 && styles.selected
          }`}
          icon="💪"
        >
          Your Expertise
        </Button>
      </div>
      <div data-testid="Dashboard" />
    </MainLayout>
  );
};

export default Dashboard;
