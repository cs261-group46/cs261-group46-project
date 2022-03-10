import { MentorType } from "./Mentor";
import { TopicWithPriorityType } from "./Topic";
import { UserType } from "./User";

export type MenteeType = {
  about: string;
  id: number;
  topics: TopicWithPriorityType[];
  user: UserType;
  plans_of_action: PlanOfAction[];
  mentor?: MentorType;
};
