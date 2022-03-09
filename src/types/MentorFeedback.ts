import { MentorType } from "./Mentor";
export type MentorFeedbackType = {
  id: number;
  feedback: string | null;
  score: number | null;
  mentor: MentorType;
};
