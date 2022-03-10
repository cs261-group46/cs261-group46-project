import React, { FC, Fragment, useMemo, useState } from "react";
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
  const { meetings_hosted = undefined, stateChangingHandler } = UseVerifyUser<{
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

  const [showWarning, setShowWarning] = useState(false);
  const expert_meetings_hosted = useMemo(
    () =>
      meetings_hosted
        ? meetings_hosted.filter(
            (meeting) => meeting.meeting_type !== "one on one meeting"
          )
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(meetings_hosted)]
  );

  // const [groupSessions, setGroupSessions] = useState<YourGroupSessionType[]>();
  const pageSize = 3;
  const [page, setPage] = useState(0);
  const hasPages = (expert_meetings_hosted?.length ?? 0) > 0;
  const pageAmount = Math.ceil(
    (expert_meetings_hosted?.length ?? 0) / pageSize
  );

  const groupSessionsOnPage = expert_meetings_hosted?.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const [selectedGroupSessions] = useState<MeetingType>();

  const editHandler = () => {};

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
    } catch (errors) {
      console.log(errors);
    }
  };

  return (
    <DashboardSubpageLayout title={"Group Sessions"}>
      <Button href="/expert/group-sessions/create">Create a Session</Button>
      <div className={styles.YourGroupSessions} data-testid="YourGroupSessions">
        {groupSessionsOnPage ? (
          <Fragment>
            {groupSessionsOnPage.map((meeting) => {
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
                        buttonStyle: "primary",
                        onClick: editHandler,
                        children: "Edit",
                      },
                      {
                        onClick: setShowWarning.bind(null, true),
                        children: "Remove",
                      },
                    ]}
                  />
                  {showWarning && (
                    <SystemMessage
                      sort={"popup"}
                      type={"alert"}
                      description={`Are you sure you want to delete the ${meeting.title} session?`}
                      visible={showWarning}
                      onClose={setShowWarning.bind(null, false)}
                    >
                      <Button
                        buttonStyle="primary"
                        onClick={() => {
                          setShowWarning(false);
                          removeHandler(meeting.id);
                        }}
                      >
                        Confirm
                      </Button>
                      <Button onClick={setShowWarning.bind(null, false)}>
                        Cancel
                      </Button>
                    </SystemMessage>
                  )}
                </div>
              );
            })}
            {groupSessionsOnPage.length === 0 && (
              <p>You have no group sessions</p>
            )}
          </Fragment>
        ) : (
          // else not loaded yet
          <LoadingSpinner />
        )}
        {hasPages && (
          <div className={styles.pagecontainer}>
            <PageStepper
              page={page}
              setPage={(newPage) => {
                setPage(newPage);
                window.scrollTo(0, 0);
              }}
              maxPages={pageAmount}
            />
          </div>
        )}
        <div
          className={`${styles.selectedworkshop} ${
            selectedGroupSessions ? styles.visible : styles.invisible
          }`}
        >
          {/* {selectedGroupSessions && (
            <ContentCard
              key={selectedGroupSessions.id}
              heading={selectedGroupSessions.title}
              sections={[
                {
                  title: "When",
                  content: getDateString(
                    new Date(selectedGroupSessions.date),
                    selectedGroupSessions.duration
                  ),
                },
                {
                  title: "Where",
                  content: selectedGroupSessions.room.name,
                },
                {
                  title: "Capacity",
                  content: `${
                    selectedGroupSessions.capacity -
                    selectedGroupSessions.attendees.length
                  } / ${selectedGroupSessions.capacity} slots left`,
                },
                {
                  className: styles.type,
                  title: "Type",
                  content: <Tag>{selectedGroupSessions.meeting_type}</Tag>,
                },
              ]}
              buttons={[
                {
                  buttonStyle: "primary",
                  onClick: joinHandler,
                  children: "Edit",
                },
                {
                  onClick: joinHandler,
                  children: "Remove",
                },
              ]}
            />
            <div className={styles.workshopcard}>
              <div className={styles.header}>
                <Title text={selectedWorkshop.title} />
                <p>
                  {getDateString(
                    selectedWorkshop.date,
                    selectedWorkshop.duration
                  )}
                </p>
                <p>{selectedWorkshop.room_name}</p>
                <p>
                  {selectedWorkshop.capacity - selectedWorkshop.signups} /{" "}
                  {selectedWorkshop.capacity} slots left
                </p>
              </div>
              <p className={styles.description}>
                {selectedWorkshop.description}
              </p>
              <div className={styles.footer}>
                <Button
                  buttonStyle={"primary"}
                  icon={"📅"}
                  onClick={() => setSelectedWorkshop(undefined)}
                >
                  Sign Up
                </Button>
              </div>

              <img
                className={styles.x}
                src={""}
                alt={"close"}
                width={25}
                height={25}
                onClick={() => setSelectedWorkshop(undefined)}
              />
            </div>
          )} */}
        </div>
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourGroupSessions;
