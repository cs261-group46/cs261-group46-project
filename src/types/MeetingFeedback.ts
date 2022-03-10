import { MeetingType } from "./Meeting";
import { UserType } from "./User";
export type MeetingFeedbackType = {
  id: number;
  feedback: string;
  user?: UserType;
  meeting: MeetingType;
};
