import React, { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { destroy, get, update } from "../../../api/api";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import styles from "./Meetings.module.scss";
import { MeetingType } from "../../../types/Meeting";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import Button from "../../../components/UI/Button/Button";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import Tag from "../../../components/UI/Tag/Tag";
import SystemMessage from "../../../components/UI/SystemMessage/SystemMessage";
import { UserType } from "../../../types/User";
import PagePicker from "../../../components/UI/PagePicker/PagePicker";
import { MeetingFeedbackType } from "../../../types/MeetingFeedback";
import { MenteeType } from "../../../types/Mentee";
import { MentorType } from "../../../types/Mentor";
import { MentorFeedbackType } from "../../../types/MentorFeedback";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";

interface MeetingsProps {}

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

const hasConfirmedMessage = (
  meeting: MeetingType,
  theirsPosition: string | null
) => {
  if (!theirsPosition) {
    theirsPosition = "";
  }
  if (!meeting.attendees) {
    meeting.attendees = [{} as UserType];
  }

  if (!meeting.invited) {
    meeting.invited = [];
  }

  if (meeting.attendees.length === 0 && meeting.invited.length === 0) {
    if (!meeting.host) {
      // you are the host and the other has rejected invite
      return `The ${theirsPosition} has declined their invite.`;
    }
  }
  if (meeting.attendees.length > 0 && meeting.invited.length === 0) {
    if (!meeting.host) {
      // you are the host and the other has accepted invite
      return `Yes, the ${theirsPosition} has confirmed their attendance.`;
    } else {
      return "Yes, you've confirmed your attendance";
    }
  }

  if (meeting.attendees.length === 0 && meeting.invited.length > 0) {
    if (!meeting.host) {
      // you are the host and the other has not yet responded
      return `No, the ${theirsPosition} has not yet confirmed their attendance.`;
    }
  }
  return "";
};

const Meetings: FC<MeetingsProps> = () => {
  const {
    userId = null,
    mentee = null,
    mentor_id = null,
    meetings_hosted = [],
    meetings_attending = [],
    meetings_invited = [],
    stateChangingHandler,
  } = UseVerifyUser<{
    userId: number | null;
    mentee: MenteeType | null;
    mentor_id: number | null;
    meetings_hosted: MeetingType[];
    meetings_attending: MeetingType[];
    meetings_invited: MeetingType[];
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee",
      },
      {
        dataPoint: "mentor.id",
      },
      {
        dataPoint: "meetings_hosted",
      },
      {
        dataPoint: "meetings_attending",
      },
      {
        dataPoint: "meetings_invited",
      },
    ],
  });

  const showMessage = UseSystemMessage();

  let { menteeId } = useParams();
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [pageMentee, setPageMentee] = useState<MenteeType>();

  const validateRole = useCallback(async () => {
    if (
      (!mentee && !mentor_id) ||
      menteeId === undefined ||
      (mentee && mentee.id !== Number.parseInt(menteeId) && !mentor_id)
    ) {
      showMessage("error", "You don't have permission to access this page.");
      return navigate("/dashboard");
    }

    if (!mentee || mentee.id !== Number.parseInt(menteeId)) {
      // they are not the mentee, they are a mentor, are they the mentor for the mentee?
      try {
        const data = await get({
          resource: "mentees",
          entity: Number.parseInt(menteeId),
          args: {
            fields: [""],
          },
        });

        if (mentor_id !== data.mentee.mentor.id) {
          // they are not the mentor
          showMessage(
            "error",
            "You don't have permission to access this page."
          );
          return navigate("/dashboard");
        }
        setTheirsPosition("mentee");
        setPageMentee(data.mentee);
        setValidated(true);
      } catch (errors) {
        showMessage("error", errors);
      }
    } else {
      setPageMentee(mentee);
      setValidated(true);
      setTheirsPosition("mentor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menteeId, showMessage, JSON.stringify(mentee), mentor_id, navigate]);

  useEffect(() => {
    if (userId) {
      validateRole();
    }
  }, [userId, validateRole]);

  const [theirsPosition, setTheirsPosition] = useState<
    "mentor" | "mentee" | null
  >(null);

  const [page, setPage] = useState(0);
  const [showWarning, setShowWarning] = useState(-1);
  const [showWarning2, setShowWarning2] = useState(-1);

  const [mentormentee_meetings_hosted, set_mentormentee_meetings_hosted] =
    useState<MeetingType[]>([]);

  const [mentormentee_meetings_invited, set_mentormentee_meetings_invited] =
    useState<MeetingType[]>([]);

  const [mentormentee_meetings_attending, set_mentormentee_meetings_attending] =
    useState<MeetingType[]>([]);

  const [confirmed_meetings, setConfirmedMeetings] = useState<MeetingType[]>(
    []
  );
  const [mentormentee_meetings_feedback, set_mentormentee_meetings_feedback] =
    useState<MeetingFeedbackType[]>([]);

  useEffect(() => {
    set_mentormentee_meetings_hosted(
      meetings_hosted.filter(
        (meeting) => meeting.meeting_type === "one on one meeting"
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(meetings_hosted)]);

  useEffect(() => {
    console.log("this effect reruns for whatever reason");

    set_mentormentee_meetings_invited(
      meetings_invited.filter(
        (meeting) => meeting.meeting_type === "one on one meeting"
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(meetings_invited)]);

  useEffect(() => {
    set_mentormentee_meetings_attending(
      meetings_attending.filter(
        (meeting) => meeting.meeting_type === "one on one meeting"
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(meetings_attending)]);

  useEffect(() => {
    if (pageMentee && pageMentee.mentor) {
      set_mentormentee_meetings_feedback(() => {
        let feedbacks: MeetingFeedbackType[] = [];

        for (const m of mentormentee_meetings_hosted) {
          feedbacks = feedbacks.concat(
            m.feedback.map((feedback) => ({ ...feedback, meeting: m }))
          );
        }

        for (const m of mentormentee_meetings_attending) {
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
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(mentormentee_meetings_hosted),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(pageMentee),
    userId,
  ]);

  useEffect(() => {
    setConfirmedMeetings((prevMeetings: MeetingType[]) => {
      const filtered = mentormentee_meetings_attending.filter(
        (meeting) =>
          !prevMeetings.find((prevMeeting) => prevMeeting.id === meeting.id)
      );
      prevMeetings.push(...filtered);
      prevMeetings.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        const a_date = new Date(a.date);
        const b_date = new Date(b.date);
        return a_date.getTime() - b_date.getTime();
      });
      return prevMeetings;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentormentee_meetings_attending)]);

  useEffect(() => {
    setConfirmedMeetings((prevMeetings: MeetingType[]) => {
      const filtered = mentormentee_meetings_hosted.filter(
        (meeting) =>
          !prevMeetings.find((prevMeeting) => prevMeeting.id === meeting.id)
      );
      prevMeetings.push(...filtered);
      prevMeetings.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        const a_date = new Date(a.date);
        const b_date = new Date(b.date);
        return a_date.getTime() - b_date.getTime();
      });
      return prevMeetings;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentormentee_meetings_hosted)]);

  const removeHandler = async (meetingId: number) => {
    try {
      await destroy({
        resource: "meetings",
        entity: meetingId,
      });

      setConfirmedMeetings((prevMeetings) => {
        return prevMeetings.filter((m) => m.id !== meetingId);
      });

      showMessage("success", "Meeting removed successfully.");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const declineHandler = async (meetingId: number) => {
    try {
      const body = {
        confirmed: false,
        user_id: userId,
      };

      await update({
        resource: "meetings",
        entity: meetingId,
        body: body,
      });

      set_mentormentee_meetings_invited((prevMeetings) => {
        return prevMeetings.filter((m) => m.id !== meetingId);
      });

      showMessage("success", "Meeting invite declined successfully.");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const confirmHandler = async (meeting: MeetingType) => {
    try {
      const body = {
        confirmed: true,
        user_id: userId,
      };
      await update({
        resource: "meetings",
        entity: meeting.id,
        body: body,
      });
      meeting.attendees.push({} as UserType);

      stateChangingHandler((prevState) => {
        const filtered = prevState.meetings_invited.filter((m) => {
          console.log(m.id);
          console.log(meeting.id);
          console.log(m.id !== meeting.id);

          return m.id !== meeting.id;
        });
        return { ...prevState, meetings_invited: filtered };
      });

      setConfirmedMeetings((prevMeetings) => {
        const meets = [...prevMeetings];
        meets.push(meeting);
        return meets;
      });

      showMessage("success", "Meeting invite confirmed successfully.");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  return (
    <DashboardSubpageLayout title={"Meetings"}>
      <Button href={`/meetings/${menteeId}/create`}>Create a Meeting</Button>

      <PagePicker
        pickers={[
          {
            text: "Meetings",
            onClick: () => {
              setPage(0);
            },
            selected: page === 0,
          },
          {
            text: "Invites",
            onClick: () => {
              setPage(1);
            },
            selected: page === 1,
          },
          {
            text: "Feedback",
            onClick: () => {
              setPage(2);
            },
            selected: page === 2,
          },
        ]}
        buttons={{
          buttonLeft: () => {
            setPage((prev) => (prev > 0 ? prev - 1 : prev));
          },
          buttonRight: () => {
            setPage((prev) => (prev < 2 ? prev + 1 : prev));
          },
        }}
      />

      <div className={styles.YourGroupSessions} data-testid="Meetings">
        {page === 0 &&
          confirmed_meetings.length > 0 &&
          confirmed_meetings.map((meeting, index) => {
            return (
              <div key={index}>
                <ContentCard
                  heading={meeting.title}
                  sections={[
                    {
                      title: "Host",
                      content: meeting.host
                        ? `${meeting.host.first_name} ${meeting.host.last_name}`
                        : "You",
                    },
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
                      title: "Confirmed?",
                      content: hasConfirmedMessage(meeting, theirsPosition),
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
                    !meeting.host && {
                      onClick: setShowWarning.bind(null, meeting.id),
                      children: "Remove",
                    },
                  ]}
                />
                {showWarning === meeting.id && (
                  <SystemMessage
                    sort={"popup"}
                    type={"alert"}
                    description={`Are you sure you want to delete the ${meeting.title} meeting?`}
                    visible={true}
                    onClose={setShowWarning.bind(null, -1)}
                  >
                    <Button
                      buttonStyle="primary"
                      onClick={() => {
                        removeHandler(meeting.id);
                        setShowWarning(-1);
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
          })}
        {validated && page === 0 && confirmed_meetings.length === 0 && (
          <p>You have no meetings with your {theirsPosition}</p>
        )}
        {validated &&
          page === 1 &&
          mentormentee_meetings_invited.length > 0 &&
          mentormentee_meetings_invited.map((meeting, index) => {
            return (
              <div key={index}>
                <ContentCard
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
                      buttonStyle: "primary",
                      onClick: confirmHandler.bind(null, meeting),
                      children: "Confirm",
                    },
                    {
                      onClick: setShowWarning2.bind(null, meeting.id),
                      children: "Decline",
                    },
                  ]}
                />
                {showWarning2 === meeting.id && (
                  <SystemMessage
                    sort={"popup"}
                    type={"alert"}
                    description={`Are you sure you want to decline the ${meeting.title} meeting request?`}
                    visible={true}
                    onClose={setShowWarning2.bind(null, -1)}
                  >
                    <Button
                      buttonStyle="primary"
                      onClick={() => {
                        declineHandler(meeting.id);
                        setShowWarning2(-1);
                      }}
                    >
                      Confirm
                    </Button>
                    <Button onClick={setShowWarning2.bind(null, -1)}>
                      Cancel
                    </Button>
                  </SystemMessage>
                )}
              </div>
            );
          })}
        {validated &&
          page === 1 &&
          mentormentee_meetings_invited.length === 0 && (
            <p>You have no meetings invites by your {theirsPosition}</p>
          )}

        {validated &&
          page === 2 &&
          mentormentee_meetings_feedback.length > 0 &&
          mentormentee_meetings_feedback.map((feedback, index) => {
            return (
              <ContentCard
                key={index + "c"}
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
          })}
        {validated &&
          page === 2 &&
          mentormentee_meetings_feedback.length === 0 && (
            <p>You have no meeting feedback</p>
          )}
      </div>
    </DashboardSubpageLayout>
  );
};

export default Meetings;
