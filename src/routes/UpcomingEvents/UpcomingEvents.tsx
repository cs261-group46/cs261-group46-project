import React, { FC, useState } from "react";
import styles from "./UpcomingEvents.module.scss";
import Event from "../../components/UpcommingEvents/Event/Event";
import Button from "../../components/UI/Button/Button";
import { EventProps } from "../../components/UpcommingEvents/Event/Event.d";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";

interface UpcomingEventsProps {
  // events: EventProps[];
}

const DUMMY_EVENTS: EventProps[] = [
  {
    sessionType: "workshop",
    subject: "Crafting",
    mentee: "2",
    mentor: "5",
  },
];

const UpcomingEvents: FC<UpcomingEventsProps> = (props) => {
  // UseVerifyAuth();
  const [filterEvents, setFilterEvents] = useState<number>(0);

  return (
    <DashboardSubpageLayout title={"Upcoming Events"}>
      <div className={styles.buttonDiv}>
        <Button
          className={styles.firstButton}
          onClick={() => {
            setFilterEvents(0);
          }}
          buttonStyle={(filterEvents === 0 && "primary") || "default"}
        >
          All
        </Button>
        <Button
          className={styles.middleButton}
          onClick={() => {
            setFilterEvents(1);
          }}
          buttonStyle={(filterEvents === 1 && "primary") || "default"}
        >
          Learn
        </Button>
        <Button
          className={styles.lastButton}
          onClick={() => {
            setFilterEvents(2);
          }}
          buttonStyle={(filterEvents === 2 && "primary") || "default"}
        >
          Mentor
        </Button>
      </div>

      <div className={styles.container}>
        {DUMMY_EVENTS.map((event_props, index) => (
          <Event event={event_props} key={index} />
        ))}
      </div>

      <div data-testid="UpcomingEvents" />
    </DashboardSubpageLayout>
  );
};

export default UpcomingEvents;
