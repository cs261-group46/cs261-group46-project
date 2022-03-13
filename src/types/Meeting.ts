import { MeetingFeedbackType } from "./MeetingFeedback";
import { TopicType } from "./Topic";
import { Room } from "./Room";
import { UserType } from "./User";

export type MeetingType = {
  host?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  description: string;
  attendees: UserType[];
  capacity: number;
  date: string;
  duration: number;
  feedback: MeetingFeedbackType[];
  id: number;
  invited?: UserType[];
  link: string;
  meeting_type: "group session" | "workshop" | "one on one meeting";
  room: Room;
  title: string;
  topics: TopicType[];
};
