import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./YourGroupSessions.module.scss";
import Button from "../../../components/UI/Button/Button";
import PageStepper from "../../../components/UI/PageStepper/PageStepper";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import Tag from "../../../components/UI/Tag/Tag";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { MeetingType } from "../../../types/Meeting";
import { destroy } from "../../../api/api";
import SystemMessage from "../../../components/UI/SystemMessage/SystemMessage";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";
import PagePicker from "../../../components/UI/PagePicker/PagePicker";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import { MeetingFeedbackType } from "../../../types/MeetingFeedback";

interface YourGroupSessionsProps {}

const getDateString = (date: Date, duration: number) => {
  let start = date;
  let end = new Date(
    new Date(start).setTime(start.getTime() + duration * 60 * 1000)
  );

  return (
    <>
      {start.toDateString()}
      <br />
      {`${start.getUTCHours().toString().padStart(2, "0")}:${start
        .getMinutes()
        .toString()
        .padStart(2, "0")} - ${end
        .getUTCHours()
        .toString()
        .padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`}
    </>
  );
};

const YourGroupSessions: FC<YourGroupSessionsProps> = () => {
  const {
    expert_id = null,
    meetings_hosted = undefined,
    stateChangingHandler,
  } = UseVerifyUser<{
    expert_id: number | null;
    meetings_hosted: MeetingType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "expert.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "meetings_hosted",
      },
    ],
  });

  const showMessage = UseSystemMessage();

  const [expert_meetings_hosted, set_expert_meetings_hosted] =
    useState<MeetingType[]>();

  const [expert_meetings_feedback, set_expert_meetings_feedback] =
    useState<MeetingFeedbackType[]>();

  const [showWarning, setShowWarning] = useState(-1);
  useEffect(() => {
    set_expert_meetings_hosted(
      meetings_hosted
        ? meetings_hosted.filter((meeting) => {
            const date = new Date(meeting.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return (
              meeting.meeting_type !== "one on one meeting" &&
              date.getTime() >= today.getTime()
            );
          })
        : undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(meetings_hosted)]);

  useEffect(() => {
    if (expert_meetings_hosted) {
      set_expert_meetings_feedback(() => {
        let feedbacks: MeetingFeedbackType[] = [];

        for (const m of expert_meetings_hosted) {
          feedbacks = feedbacks.concat(
            m.feedback.map((feedback) => ({ ...feedback, meeting: m }))
          );
        }

        return feedbacks.sort((f1, f2) => {
          const f1Date = new Date(f1.meeting.date);
          const f2Date = new Date(f2.meeting.date);
          return f2Date.getTime() - f1Date.getTime();
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(expert_meetings_hosted)]);

  // const [groupSessions, setGroupSessions] = useState<YourGroupSessionType[]>();
  const [subpage, setSubpage] = useState(0);

  const removeHandler = async (meetingId: number) => {
    try {
      await destroy({
        resource: "meetings",
        entity: meetingId,
      });

      stateChangingHandler((prevState) => ({
        ...prevState,
        meetings_hosted: prevState.meetings_hosted.filter(
          (m) => m.id !== meetingId
        ),
      }));
      showMessage("success", "Group Session removed successfully.");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const feedback = [];

  return (
    <DashboardSubpageLayout title={"Group Sessions"}>
      <Button href="/expert/group-sessions/create">Create a Session</Button>
      <PagePicker
        pickers={[
          {
            text: "Sessions",
            onClick: () => {
              setSubpage(0);
            },
            selected: subpage === 0,
          },
          {
            text: "Feedback",
            onClick: () => {
              setSubpage(1);
            },
            selected: subpage === 1,
          },
        ]}
        buttons={{
          buttonLeft: () => {
            setSubpage((prev) => (prev > 0 ? prev - 1 : prev));
          },
          buttonRight: () => {
            setSubpage((prev) => (prev < 1 ? prev + 1 : prev));
          },
        }}
      />

      <div className={styles.YourGroupSessions} data-testid="YourGroupSessions">
        {subpage === 0 &&
          (expert_meetings_hosted ? (
            expert_meetings_hosted.length > 0 ? (
              expert_meetings_hosted.map((meeting) => {
                if (!meeting.attendees) meeting.attendees = [];
                return (
                  <div key={meeting.id}>
                    <ContentCard
                      key={meeting.id}
                      heading={meeting.title}
                      sections={[
                        {
                          title: "When",
                          content: getDateString(
                            new Date(meeting.date),
                            meeting.duration
                          ),
                        },
                        {
                          title: "Where",
                          content: meeting.room.name,
                        },
                        {
                          title: "Capacity",
                          content: `${
                            meeting.capacity - meeting.attendees.length
                          } / ${meeting.capacity} slots left`,
                        },
                        {
                          className: styles.tags,
                          title: "Type",
                          content: <Tag>{meeting.meeting_type}</Tag>,
                        },
                        meeting.topics.length > 0 && {
                          className: styles.tags,
                          title: "Topics",
                          content: meeting.topics.map((topic) => (
                            <Tag key={topic.id}>{topic.name}</Tag>
                          )),
                        },
                      ]}
                      buttons={[
                        {
                          onClick: setShowWarning.bind(null, meeting.id),
                          children: "Remove",
                        },
                      ]}
                    />
                    {showWarning === meeting.id && (
                      <SystemMessage
                        sort={"popup"}
                        type={"alert"}
                        description={`Are you sure you want to delete the ${meeting.title} session?`}
                        visible={true}
                        onClose={setShowWarning.bind(null, -1)}
                      >
                        <Button
                          buttonStyle="primary"
                          onClick={() => {
                            setShowWarning(-1);
                            removeHandler(meeting.id);
                          }}
                        >
                          Confirm
                        </Button>
                        <Button onClick={setShowWarning.bind(null, -1)}>
                          Cancel
                        </Button>
                      </SystemMessage>
                    )}
                  </div>
                );
              })
            ) : (
              <p>You have no group sessions</p>
            )
          ) : (
            <LoadingSpinner />
          ))}

        {subpage === 1 &&
          (expert_meetings_feedback ? (
            expert_meetings_feedback.length > 0 ? (
              expert_meetings_feedback.map((feedback, index) => {
                return (
                  <ContentCard
                    key={index}
                    heading={feedback.meeting.title}
                    sections={[
                      {
                        title: "When",
                        content: getDateString(
                          new Date(feedback.meeting.date),
                          feedback.meeting.duration
                        ),
                      },
                      {
                        title: "Feedback",
                        content: `"${feedback.feedback}" - ${
                          feedback.user
                            ? feedback.user.first_name +
                              " " +
                              feedback.user.last_name
                            : "You"
                        }`,
                      },
                    ]}
                  />
                );
              })
            ) : (
              <p>You have no group session feedback</p>
            )
          ) : (
            <LoadingSpinner />
          ))}
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourGroupSessions;
