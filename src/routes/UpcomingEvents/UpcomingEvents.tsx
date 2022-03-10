import React, { FC, useEffect, useState } from "react";
import styles from "./UpcomingEvents.module.scss";
import Event from "../../components/UpcommingEvents/Event/Event";
import Button from "../../components/UI/Button/Button";
import { EventProps } from "../../components/UpcommingEvents/Event/Event.d";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";
import { MeetingType } from "../../types/Meeting";
import PagePicker from "../../components/UI/PagePicker/PagePicker";
import ContentCard from "../../components/UI/ContentCard/ContentCard";
import Tag from "../../components/UI/Tag/Tag";
import { UserType } from "../../types/User";
import UseSystemMessage from "../../hooks/UseSystemMessage/UseSystemMessage";

interface UpcomingEventsProps {}

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

const UpcomingEvents: FC<UpcomingEventsProps> = (props) => {
  const {
    userId = null,
    meetings_hosted = [],
    meetings_attending = [],
  } = UseVerifyUser<{
    userId: number | null;
    expert_id: number | null;
    meetings_hosted: MeetingType[] | [];
    meetings_attending: MeetingType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "meetings_hosted",
      },
      {
        dataPoint: "meetings_attending",
      },
    ],
  });

  const [filterEvents, setFilterEvents] = useState<number>(0);
  const [allMeetings, setAllMeetings] = useState<MeetingType[]>([]);
  const [mentorshipMeetings, setMentorshipMeetings] = useState<MeetingType[]>(
    []
  );
  const [groupSessions, setGroupSessions] = useState<MeetingType[]>([]);
  const [pastMeetings, setPastMeetings] = useState<MeetingType[]>([]);

  useEffect(() => {
    const noUnconfirmed = meetings_hosted.filter(
      (m) => m.meeting_type !== "one on one meeting" || m.attendees.length > 0
    );

    const meetingsUnion = [...noUnconfirmed, ...meetings_attending];

    const meetingsSorted = meetingsUnion.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return bDate.getTime() - aDate.getTime();
    });

    const futureMeetings = meetingsSorted.filter(
      (meeting) => new Date(meeting.date) >= new Date()
    );

    setAllMeetings(futureMeetings);

    const mentorshipMeets = futureMeetings.filter(
      (meeting) => meeting.meeting_type === "one on one meeting"
    );
    setMentorshipMeetings(mentorshipMeets);

    setGroupSessions(
      futureMeetings.filter(
        (meeting) => meeting.meeting_type !== "one on one meeting"
      )
    );
    setPastMeetings(
      meetingsSorted.filter((meeting) => new Date(meeting.date) < new Date())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(meetings_attending), JSON.stringify(meetings_hosted)]);

  return (
    <DashboardSubpageLayout title={"Calendar"}>
      {userId && (
        <PagePicker
          pickers={[
            {
              text: "All",
              onClick: () => {
                setFilterEvents(0);
              },
              selected: filterEvents === 0,
            },
            {
              text: "Mentorship",
              onClick: () => {
                setFilterEvents(1);
              },
              selected: filterEvents === 1,
            },
            {
              text: "Group Sessions",
              onClick: () => {
                setFilterEvents(2);
              },
              selected: filterEvents === 2,
            },
            {
              text: "Past Meetings",
              onClick: () => {
                setFilterEvents(3);
              },
              selected: filterEvents === 3,
            },
          ]}
          buttons={{
            buttonLeft: () => {
              setFilterEvents((prev) => (prev > 0 ? prev - 1 : prev));
            },
            buttonRight: () => {
              setFilterEvents((prev) => (prev < 3 ? prev + 1 : prev));
            },
          }}
        />
      )}

      {userId &&
        filterEvents === 0 &&
        allMeetings.map((meeting, index) => (
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
                className: styles.tags,
                title: "Type",
                content: <Tag>{meeting.meeting_type}</Tag>,
              },
              meeting.topics.length > 0 && {
                className: styles.tags,
                title: "Topics Covered",
                content: meeting.topics.map((topic) => (
                  <Tag key={topic.id}>{topic.name}</Tag>
                )),
              },
            ]}
            buttons={[]}
          />
        ))}

      {userId && filterEvents === 0 && allMeetings.length === 0 && (
        <p>You have no upcoming meetings.</p>
      )}

      {userId &&
        filterEvents === 1 &&
        mentorshipMeetings.map((meeting, index) => (
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
                className: styles.tags,
                title: "Type",
                content: <Tag>{meeting.meeting_type}</Tag>,
              },
              meeting.topics.length > 0 && {
                className: styles.tags,
                title: "Topics Covered",
                content: meeting.topics.map((topic) => (
                  <Tag key={topic.id}>{topic.name}</Tag>
                )),
              },
            ]}
            buttons={[]}
          />
        ))}
      {userId && filterEvents === 1 && mentorshipMeetings.length === 0 && (
        <p>You have no upcoming mentorship meetings.</p>
      )}

      {userId &&
        filterEvents === 2 &&
        groupSessions.map((meeting, index) => (
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
                className: styles.tags,
                title: "Type",
                content: <Tag>{meeting.meeting_type}</Tag>,
              },
              meeting.topics.length > 0 && {
                className: styles.tags,
                title: "Topics Covered",
                content: meeting.topics.map((topic) => (
                  <Tag key={topic.id}>{topic.name}</Tag>
                )),
              },
            ]}
            buttons={[]}
          />
        ))}
      {userId && filterEvents === 2 && groupSessions.length === 0 && (
        <p>You have no upcoming group session.</p>
      )}
      {userId &&
        filterEvents === 3 &&
        pastMeetings.map((meeting, index) => (
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
                className: styles.tags,
                title: "Type",
                content: <Tag>{meeting.meeting_type}</Tag>,
              },
              meeting.topics.length > 0 && {
                className: styles.tags,
                title: "Topics Covered",
                content: meeting.topics.map((topic) => (
                  <Tag key={topic.id}>{topic.name}</Tag>
                )),
              },
              meeting.feedback.find((f) => f.user && f.user.id === userId) !==
                undefined && {
                className: styles.tags,
                title: "Feedback Given",
                content: `"${
                  meeting.feedback.find((f) => f.user && f.user.id === userId)
                    ?.feedback
                }"`,
              },
            ]}
            buttons={[
              (meeting.host !== undefined ||
                meeting.meeting_type === "one on one meeting") &&
              meeting.feedback.find((f) => f.user && f.user.id === userId) ===
                undefined
                ? {
                    children: "Give Feedback",
                    href: `/meetings/give-feedback/${meeting.id}`,
                  }
                : false,
            ]}
          />
        ))}
      {userId && filterEvents === 3 && pastMeetings.length === 0 && (
        <p>You have no past meetings.</p>
      )}

      <div data-testid="UpcomingEvents" />
    </DashboardSubpageLayout>
  );
};

export default UpcomingEvents;
