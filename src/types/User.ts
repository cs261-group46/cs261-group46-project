import { MentorType } from "./Mentor";
import { TopicType, TopicWithPriorityType } from "./Topic";
import { DepartmentType } from "./Department";

export type FullUserType = {
  user: {
    department: DepartmentType;
    email: string;
    expert: { id: string; topics: TopicType[] } | null;
    first_name: string;
    last_name: string;
    mentor: MentorType | null;
    mentee: {
      score: number;
      topics: TopicWithPriorityType[];
      about: string;
      mentor: {
        user: {
          first_name: string;
          last_name: string;
        };
      } | null;
    } | null;
  };
};

export type UserType = {
  id: number;
  department: DepartmentType;
  email: string;
  first_name: string;
  last_name: string;
};
