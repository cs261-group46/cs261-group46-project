import { DepartmentType } from "./Department";
import { TopicWithPriorityType } from "./Topic";

export type MentorshipRequestType = {
  id: number;
  user: {
    department: DepartmentType;
    email: string;
    first_name: string;
    last_name: string;
    topics: TopicWithPriorityType;
    id: number;
  };
};
