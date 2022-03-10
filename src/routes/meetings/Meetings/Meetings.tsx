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

const Meetings: FC<MeetingsProps> = () => {
  const {
    userId = null,
    mentee_id = null,
    mentor_id = null,
    meetings_hosted = [],
    meetings_attending = [],
    meetings_invited = [],
  } = UseVerifyUser<{
    userId: number | null | undefined;
    mentee_id: number | null | undefined;
    mentor_id: number | null | undefined;
    meetings_hosted: MeetingType[] | null | undefined;
    meetings_attending: MeetingType[] | null | undefined;
    meetings_invited: MeetingType[] | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
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

  const [theirsPosition, setTheirsPosition] = useState<
    "mentor" | "mentee" | null
  >();
  const [page, setPage] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const [showWarning2, setShowWarning2] = useState(false);

  const mentormentee_meetings_hosted = meetings_hosted
    ? meetings_hosted.filter(
        (meeting) => meeting.meeting_type === "one on one meeting"
      )
    : [];

  const mentormentee_meetings_invited = meetings_invited
    ? meetings_invited.filter(
        (meeting) => meeting.meeting_type === "one on one meeting"
      )
    : [];

  const mentormentee_meetings_attending = meetings_attending
    ? meetings_attending.filter(
        (meeting) => meeting.meeting_type === "one on one meeting"
      )
    : [];

  const [confirmed_meetings, setConfirmedMeetings] = useState<MeetingType[]>(
    []
  );

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
        return b_date.getTime() - a_date.getTime();
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
        return b_date.getTime() - a_date.getTime();
      });
      return prevMeetings;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentormentee_meetings_hosted)]);

  const [validated, setValidated] = useState(false);

  let { menteeId } = useParams();
  const navigate = useNavigate();

  const validateRole = useCallback(async () => {
    if ((!mentee_id && !mentor_id) || menteeId === undefined) {
      return navigate("/dashboard");
    }
    if (mentee_id !== Number.parseInt(menteeId)) {
      try {
        const data = await get({
          resource: "mentees",
          entity: Number.parseInt(menteeId),
          args: {
            fields: ["mentor.id"],
          },
        });

        if (mentor_id !== data.mentee.mentor.id) {
          return navigate("/dashboard");
        }
        setTheirsPosition("mentee");
        setValidated(true);
      } catch (errors) {
        console.log(errors);
      }
    } else {
      setValidated(true);
      setTheirsPosition("mentor");
    }
  }, [menteeId, mentee_id, mentor_id, navigate]);

  useEffect(() => {
    if (userId) {
      validateRole();
    }
  }, [userId, validateRole]);

  const removeHandler = async (meetingId: number) => {
    try {
      await destroy({
        resource: "meetings",
        entity: meetingId,
      });
    } catch (errors) {
      console.log(errors);
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
    } catch (errors) {
      console.log(errors);
    }
  };

  const confirmHandler = async (meetingId: number) => {
    try {
      const body = {
        confirmed: true,
        user_id: userId,
      };
      await update({
        resource: "meetings",
        entity: meetingId,
        body: body,
      });
    } catch (errors) {
      console.log(errors);
    }
  };

  const hasConfirmedMessage = (meeting: MeetingType) => {
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

  return (
    <DashboardSubpageLayout title={"Group Sessions"}>
      <Button href={`/meetings/${menteeId}/create`}>Create a Meeting</Button>
      {/* <div className={styles.buttonDiv}>
        <Button
          className={styles.firstButton}
          onClick={() => {
            setPage(1);
          }}
          buttonStyle={(page === 1 && "primary") || "default"}
        >
          Meetings
        </Button>
        <Button
          className={styles.lastButton}
          onClick={() => {
            setPage(2);
          }}
          buttonStyle={(page === 2 && "primary") || "default"}
        >
          Invites
        </Button>
      </div> */}

      <PagePicker
        pickers={[
          {
            text: "Meetings",
            onClick: () => {
              setPage(1);
            },
            selected: page === 1,
          },
          {
            text: "Invites",
            onClick: () => {
              setPage(2);
            },
            selected: page === 2,
          },
        ]}
        buttons={{
          buttonLeft: () => {
            setPage((prev) => (prev > 1 ? prev - 1 : prev));
          },
          buttonRight: () => {
            setPage((prev) => (prev < 2 ? prev + 1 : prev));
          },
        }}
      />
      <div className={styles.YourGroupSessions} data-testid="Meetings">
        {page === 1 &&
          confirmed_meetings.length > 0 &&
          confirmed_meetings.map((meeting, index) => {
            return (
              <>
                <ContentCard
                  key={index}
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
                      content: hasConfirmedMessage(meeting),
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
                    // {
                    //   buttonStyle: "primary",
                    //   onClick: editHandler,
                    //   children: "Edit",
                    // },
                    {
                      onClick: setShowWarning.bind(null, true),
                      children: "Remove",
                    },
                  ]}
                />
                {showWarning && (
                  <SystemMessage
                    key={index}
                    sort={"popup"}
                    type={"alert"}
                    description={`Are you sure you want to delete the ${meeting.title} meeting?`}
                    visible={showWarning}
                    onClose={setShowWarning.bind(null, false)}
                  >
                    <Button
                      buttonStyle="primary"
                      onClick={removeHandler.bind(null, meeting.id)}
                    >
                      Confirm
                    </Button>
                    <Button onClick={setShowWarning.bind(null, false)}>
                      Cancel
                    </Button>
                  </SystemMessage>
                )}
              </>
            );
          })}
        {validated && page === 1 && confirmed_meetings.length === 0 && (
          <p>You have no meetings with your {theirsPosition}</p>
        )}
        {validated &&
          page === 2 &&
          mentormentee_meetings_invited.length > 0 &&
          mentormentee_meetings_invited.map((meeting, index) => {
            return (
              <>
                <ContentCard
                  key={index}
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
                      onClick: confirmHandler.bind(null, meeting.id),
                      children: "Confirm",
                    },
                    {
                      onClick: setShowWarning2.bind(null, true),
                      children: "Decline",
                    },
                  ]}
                />
                {showWarning2 && (
                  <SystemMessage
                    key={index}
                    sort={"popup"}
                    type={"alert"}
                    description={`Are you sure you want to decline the ${meeting.title} meeting request?`}
                    visible={showWarning2}
                    onClose={setShowWarning2.bind(null, false)}
                  >
                    <Button
                      buttonStyle="primary"
                      onClick={declineHandler.bind(null, meeting.id)}
                    >
                      Confirm
                    </Button>
                    <Button onClick={setShowWarning2.bind(null, false)}>
                      Cancel
                    </Button>
                  </SystemMessage>
                )}
              </>
            );
          })}
        {validated && page === 2 && mentormentee_meetings_invited.length === 0 && (
          // else not loaded yet
          <p>You have no meetings invites by your {theirsPosition}</p>
        )}
      </div>
    </DashboardSubpageLayout>
  );
};

export default Meetings;
