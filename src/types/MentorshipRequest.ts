import { UserType } from "./User";
import { TopicWithPriorityType } from "./Topic";

export type MentorshipRequestType = {
  id: number;
  mentee: {
    about: string;
    id: number;
    topics: TopicWithPriorityType[];
    user: UserType;
    plans_of_action: [];
  };
};

// MenteeType = {
//   about: string;
//   id: number;
//   topics: TopicWithPriorityType[];
//   user: UserType;
//   plans_of_action: PlanOfAction[];
//   mentor?: MentorType;
// };
