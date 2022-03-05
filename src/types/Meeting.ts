import { TopicType } from "./Topic";
import { Room } from "./Room";
import { UserType } from "./User";

export type MeetingType = {
  attendees: UserType[];
  capacity: number;
  date: string;
  duration: number;
  feedback: {
    feedback: string;
  };
  id: number;
  invited: UserType[];
  link: string;
  meeting_type: "group session" | "workshop" | "one on one meeting";
  room: Room;
  title: string;
  topics: TopicType[];
};
