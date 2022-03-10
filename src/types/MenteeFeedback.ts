import { MenteeType } from "./Mentee";
export type MenteeFeedbackType = {
  id: number;
  feedback: string | null;
  score: number | null;
  mentee: MenteeType;
};
