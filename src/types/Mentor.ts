export type MentorType = {
  id: number;
  about: string;
  topics: {
    id: number;
    name: string;
  }[];
  user: {
    department: { id: number; name: string };
    first_name: string;
    last_name: string;
    email: string;
  };
};
