export type Expertise = {
  label: string;
  value: number;
};

export type Expertises = Expertise[];

export type ExpertiseHandler = (expertise: Expertise) => void;
