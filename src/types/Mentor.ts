import { UserType } from "./User";
export type MentorType = {
  id: number;
  about: string;
  topics: {
    topic: {
      id: number;
      name: string;
    };
  }[];
  user: UserType;
};
