import React, { FC, useState } from "react";
import styles from "./UpcomingEvents.module.scss";
import Event from "../../components/UpcommingEvents/Event/Event";
import Button from "../../components/UI/Button/Button";
import { EventProps } from "../../components/UpcommingEvents/Event/Event.d";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";
import { MeetingType } from "../../types/Meeting";
import PagePicker from "../../components/UI/PagePicker/PagePicker";

interface UpcomingEventsProps {
  // events: EventProps[];
}

// const DUMMY_EVENTS: EventProps[] = [
//   {
//     sessionType: "workshop",
//     subject: "Crafting",
//     mentee: "2",
//     mentor: "5",
//   },
// ];

const UpcomingEvents: FC<UpcomingEventsProps> = (props) => {
  const {
    expert_id = null,
    meetings_hosted = [],
    meetings_attending = [],
    stateChangingHandler,
  } = UseVerifyUser<{
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

  return (
    <DashboardSubpageLayout title={"Upcoming Events"}>
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

      {/* <div className={styles.container}>
        
      </div> */}

      <div data-testid="UpcomingEvents" />
    </DashboardSubpageLayout>
  );
};

export default UpcomingEvents;
