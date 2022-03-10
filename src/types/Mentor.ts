import { UserType } from "./User";
export type MentorType = {
  id: number;
  about: string;
  score: number;
  topics: {
    topic: {
      id: number;
      name: string;
    };
  }[];
  user: UserType;
};
