import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./ViewGroupSessions.module.scss";
import Title from "../../../components/UI/Title/Title";
import Button from "../../../components/UI/Button/Button";
import PageStepper from "../../../components/UI/PageStepper/PageStepper";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import Tag from "../../../components/UI/Tag/Tag";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { MeetingType } from "../../../types/Meeting";
import { UserType } from "../../../types/User";

interface ViewGroupSessionsProps {}

interface GroupSessionType {
  id: string;
  host: string;
  title: string;
  date: Date;
  room_name: string;
  duration: number;
  capacity: number;
  signups: number;
  type: "workshop" | "group session";
  headline: string;
  description: string;
}

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

  // return `${start.toDateString()}
  //             ${start.getUTCHours().toString().padStart(2, "0")}:${start
  //   .getMinutes()
  //   .toString()
  //   .padStart(2, "0")} -
  //             ${end.getUTCHours().toString().padStart(2, "0")}:${end
  //   .getMinutes()
  //   .toString()
  //   .padStart(2, "0")}`;
};

const ViewGroupSessions: FC<ViewGroupSessionsProps> = () => {
  const [groupSessions, setGroupSessions] = useState<MeetingType[]>();
  const pageSize = 3;
  const [page, setPage] = useState(0);
  const hasPages = (groupSessions?.length ?? 0) > 0;
  const pageAmount = Math.ceil((groupSessions?.length ?? 0) / pageSize);
  const groupSessionsOnPage: MeetingType[] =
    groupSessions?.slice(page * pageSize, (page + 1) * pageSize) ?? [];
  const [selectedWorkshop, setSelectedWorkshop] = useState<GroupSessionType>();

  const { userId = null, meetings_invited = [] } = UseVerifyUser<{
    userId: number | null | undefined;
    meetings_invited: MeetingType[] | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "meetings_invited",
      },
    ],
  });

  // async function dummyRequest(): Promise<GroupSessionType[]> {
  //   // some code to feign an API request taking 500ms & returning the below object
  //   return new Promise((resolve) =>
  //     setTimeout(
  //       () =>
  //         resolve([
  //           {
  //             id: "1",
  //             host: "me",
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
  //             host: "somebody else",
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
  //             host: "me",
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
  //             host: "somebody else",
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
  //             host: "somebody else",
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

  const joinHandler = () => {};

  // const fetchGroupSessions = useCallback(async () => {
  //   // const fetchedGroupSessions = await dummyRequest();
  // }, [setGroupSessions]);

  useEffect(() => {
    // fetchGroupSessions();
    if (meetings_invited)
      setGroupSessions(
        meetings_invited.filter(
          (meeting) => meeting.meeting_type !== "one on one meeting"
        )
      );
  }, [JSON.stringify(meetings_invited)]);

  return (
    <DashboardSubpageLayout title={"Group Sessions"}>
      <div className={styles.ViewGroupSessions} data-testid="ViewGroupSessions">
        {groupSessions && groupSessions.length > 0 ? (
          groupSessionsOnPage.map((groupSession) => {
            return (
              <ContentCard
                key={groupSession.id}
                heading={groupSession.title}
                sections={[
                  {
                    title: "Host",
                    content: `${groupSession.host?.first_name} ${groupSession.host?.last_name}`,
                  },
                  {
                    title: "When",
                    content: getDateString(
                      new Date(groupSession.date),
                      groupSession.duration
                    ),
                  },
                  {
                    title: "Where",
                    content: groupSession.room.name,
                  },
                  {
                    title: "Capacity",
                    content: `${
                      groupSession.capacity -
                      (groupSession.attendees as UserType[]).length
                    } / ${groupSession.capacity} slots left`,
                  },
                  {
                    className: styles.type,
                    title: "Type",
                    content: <Tag>{groupSession.meeting_type}</Tag>,
                  },
                ]}
                buttons={[
                  {
                    buttonStyle: "primary",
                    onClick: joinHandler,
                    children: "Join",
                  },
                ]}
              />
            );
          })
        ) : (
          // else not loaded yet
          <p>Sorry, no workshops available</p>
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
            selectedWorkshop ? styles.visible : styles.invisible
          }`}
        >
          {/* must make sure contents are included when selected is undefined (even if its invisible) */}
          {selectedWorkshop && (
            <div className={styles.workshopcard}>
              <div className={styles.header}>
                <Title text={selectedWorkshop.title} />
                <Title text={selectedWorkshop.headline} />
                <p>Host: {selectedWorkshop.host}</p>
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

              {/* TODO: create an 'x' button component */}
              <img
                className={styles.x}
                src={""}
                alt={"close"}
                width={25}
                height={25}
                onClick={() => setSelectedWorkshop(undefined)}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardSubpageLayout>
  );
};

export default ViewGroupSessions;
