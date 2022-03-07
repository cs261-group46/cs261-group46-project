import { DepartmentType } from "./Department";
import { TopicWithPriorityType } from "./Topic";

export type MenteeType = {
  about: string;
  id: number;
  topics: TopicWithPriorityType[];
  user: {
    department: DepartmentType;
    email: string;
    first_name: string;
    last_name: string;
  };
  plans_of_action: PlanOfAction[];
};
