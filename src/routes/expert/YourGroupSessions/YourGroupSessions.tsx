import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./YourGroupSessions.module.scss";
import Title from "../../../components/UI/Title/Title";
import Button from "../../../components/UI/Button/Button";
import PageStepper from "../../../components/UI/PageStepper/PageStepper";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import Tag from "../../../components/UI/Tag/Tag";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { MeetingType } from "../../../types/Meeting";
import { destroy } from "../../../api/api";
import ReactDOM from "react-dom";
import SystemMessage from "../../../components/UI/SystemMessage/SystemMessage";

interface YourGroupSessionsProps {}

// interface YourGroupSessionType {
//   id: string;
//   title: string;
//   date: Date;
//   room_name: string;
//   duration: number;
//   capacity: number;
//   signups: number;
//   type: "workshop" | "group session";
//   headline: string;
//   description: string;
// }

const YourGroupSessions: FC<YourGroupSessionsProps> = () => {
  const { expert_id = null, meetings_hosted = [] } = UseVerifyUser<{
    expert_id: number | null | undefined;
    meetings_hosted: MeetingType[] | null | undefined;
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
  const expert_meetings_hosted = meetings_hosted
    ? meetings_hosted.filter(
        (meeting) => meeting.meeting_type !== "one on one meeting"
      )
    : [];
  // const [groupSessions, setGroupSessions] = useState<YourGroupSessionType[]>();
  const pageSize = 3;
  const [page, setPage] = useState(0);
  const hasPages = (meetings_hosted?.length ?? 0) > 0;
  const pageAmount = Math.ceil((meetings_hosted?.length ?? 0) / pageSize);

  const groupSessionsOnPage: MeetingType[] =
    meetings_hosted?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

  const [selectedGroupSessions, setSelectedGroupSessions] =
    useState<MeetingType>();

  // async function dummyRequest(): Promise<YourGroupSessionType[]> {
  //   // some code to feign an API request taking 500ms & returning the below object
  //   return new Promise((resolve) =>
  //     setTimeout(
  //       () =>
  //         resolve([
  //           {
  //             id: "1",
  //             title: "Introduction to Python",
  //             date: new Date(),
  //             room_name: "CS0.01",
  //             duration: 120,
  //             capacity: 10,
  //             signups: 2,
  //             type: "workshop",
  //             headline: "Learn python in 5 minutes",
  //             description:
  //               "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
  //           },
  //           {
  //             id: "2",
  //             title: "Introduction to C++",
  //             date: new Date(),
  //             room_name: "CS0.04",
  //             duration: 5,
  //             capacity: 100,
  //             signups: 80,
  //             type: "group session",
  //             headline: "Learn c++ in 5 minutes",
  //             description:
  //               "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
  //           },
  //           {
  //             id: "3",
  //             title: "Introduction to Python II",
  //             date: new Date(),
  //             room_name: "CS0.01",
  //             duration: 120,
  //             capacity: 10,
  //             signups: 2,
  //             type: "workshop",
  //             headline: "Learn python in 10 minutes",
  //             description:
  //               "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
  //           },
  //           {
  //             id: "4",
  //             title: "Introduction to C++ II",
  //             date: new Date(),
  //             room_name: "CS0.04",
  //             duration: 5,
  //             capacity: 100,
  //             signups: 80,
  //             type: "workshop",
  //             headline: "Learn c++ in 10 minutes",
  //             description:
  //               "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
  //           },
  //           {
  //             id: "5",
  //             title: "Introduction to C++ III",
  //             date: new Date(),
  //             room_name: "CS0.04",
  //             duration: 5,
  //             capacity: 100,
  //             signups: 80,
  //             type: "workshop",
  //             headline: "Learn c++ in 15 minutes",
  //             description:
  //               "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
  //           },
  //         ]),
  //       500
  //     )
  //   );
  // }

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

  const editHandler = () => {};

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

  // const fetchGroupSessions = useCallback(async () => {
  //   const fetchedGroupSessions = await dummyRequest();
  //   setGroupSessions(fetchedGroupSessions);
  // }, [setGroupSessions]);

  // useEffect(() => {
  //   fetchGroupSessions();
  // }, [fetchGroupSessions]);

  return (
    <DashboardSubpageLayout title={"Group Sessions"}>
      <Button href="/expert/group-sessions/create">Create a Session</Button>
      <div className={styles.YourGroupSessions} data-testid="YourGroupSessions">
        {groupSessionsOnPage ? (
          groupSessionsOnPage.map((meeting) => {
            if (!meeting.attendees) meeting.attendees = [];
            return (
              <>
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
          })
        ) : (
          // else not loaded yet
          <p>You have no group sessions</p>
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
