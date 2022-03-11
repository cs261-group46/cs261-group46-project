import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";
import { MentorType } from "../../types/Mentor";
import DashboardNavbar, { hashToSlot, pageHashes } from "./DashboardNavbar";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  const {
    userId = null,
    mentor_id: isMentor = null,
    mentee_id = null,
    mentee_mentor_id: hasMentor = null,
    expert_id: isExpert = null,
  } = UseVerifyUser<{
    userId: number | null | undefined;
    mentor_id: number | null | undefined;
    mentee_id: number | null | undefined;
    mentee_mentor_id: number | null | undefined;
    expert_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentor.id",
      },
      {
        dataPoint: "mentee.id",
      },
      {
        dataPoint: "mentee.mentor.id",
      },
      {
        dataPoint: "expert.id",
      },
    ],
  });

  const navigate = useNavigate();
  const { hash } = useLocation();
  // remove invalid hashes
  if (hash !== "" && hashToSlot(hash) === 0) navigate("/dashboard");

  const pageVisible = hash !== "" ? hashToSlot(hash) : 1;

  useEffect(() => {
    if (!pageHashes.includes(hash)) {
      navigate("/dashboard#home");
    }
  }, [hash, navigate]);

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

  const getUserData = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await get({
        resource: "users",
        entity: userId as number,
        args: {
          fields: ["notifications"],
        },
      });

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
    } catch (errors) {
      console.log(errors);
    }
  }, [userId]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const logoutHandler = async () => {
    try {
      await custom({
        endpoint: "/auth/logout",
        method: "GET",
      });
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
      {pageVisible === 1 && (
        <div className={styles.Section}>
          <Title text={"Welcome back!"} className={styles.Title} />
          <Button icon={"👤"} href={"/profile"}>
            Your Profile
          </Button>
          {/* <Button icon={"🔔"} href={"/notifications"}>
          All Notifications
        </Button> */}
          <Button icon={"📅"} href={"/calendar"}>
            Calendar
          </Button>
          <Button icon={"👍"} href={"/give-feedback"}>
            Give Us Feedback
          </Button>

          <Button icon={"👋"} onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      )}

      {pageVisible === 2 && (
        <div className={styles.Section}>
          <Title text={"Your Learning"} className={styles.Title} />

          {!mentee_id && (
            <Button
              href={"/learn/become-mentee"}
              buttonStyle="primary"
              icon={"👨‍🏫"}
            >
              Become a Mentee
            </Button>
          )}

          {!hasMentor && mentee_id && (
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
                  {notificationsLearn.length}
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

          {mentee_id && (
            <Button href={"/learn/your-mentor"} icon={"👨‍🏫"}>
              Your Mentor
            </Button>
          )}
          {mentee_id && (
            <Button href={"/learn/interests"} icon={"💡"}>
              Your Interests
            </Button>
          )}

          {mentee_id && hasMentor && (
            <Button href={`/plans-of-action/${mentee_id}`} icon={"📈"}>
              Plans of Action
            </Button>
          )}

          {mentee_id && (
            <Button href={"/learn/feedback-received"} icon={"👨‍🏫"}>
              Received Feedback
            </Button>
          )}

          {/* <Button href={"/learn/workshops"} icon={"✏️"}>
          Workshops
        </Button> */}

          <Button href={"/learn/group-sessions"} icon={"👥"}>
            Explore Group Sessions
          </Button>
        </div>
      )}

      {pageVisible === 3 && (
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

          {isMentor && (
            <Button href={"/mentor/feedback-received"} icon={"👨‍🏫"}>
              Received Feedback
            </Button>
          )}
        </div>
      )}

      {pageVisible === 4 && (
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
                  {notificationsExpert.length}
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
            <Button href={"/expert/group-sessions"} icon={"👥"}>
              Your Group Sessions
            </Button>
          )}
          {isExpert && (
            <Button href={"/expert/skills"} icon={"💪"}>
              Your Fields of Expertise
            </Button>
          )}
        </div>
      )}

      <DashboardNavbar hash={hash} />

      <div data-testid="Dashboard" />
    </MainLayout>
  );
};

export default Dashboard;
