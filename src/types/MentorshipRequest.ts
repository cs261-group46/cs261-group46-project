import { DepartmentType } from "./Department";
import { TopicWithPriorityType } from "./Topic";

export type MentorshipRequestType = {
  id: number;
  mentee: {
    about: string;
    id: number;
    topics: TopicWithPriorityType[];
    user: {
      department: DepartmentType;
      email: string;
      first_name: string;
      last_name: string;
    };
  };
};
