import { TopicType, TopicWithPriorityType } from "./Topic";
import { DepartmentType } from "./Department";
export type FullUserType = {
  department: DepartmentType;
  email: string;
  expert: { id: string; topics: TopicType[] } | null;
  first_name: string;
  last_name: string;
  mentor: {
    capacity: number;
    score: number;
    topics: TopicWithPriorityType[];
    about: string;
  } | null;
  mentee: {
    topics: TopicWithPriorityType[];
    about: string;
    mentor: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
};
