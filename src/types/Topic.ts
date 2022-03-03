export type TopicType = {
  id: number;
  name: string;
};

export type TopicWithPriorityType = {
  priority: number;
  topic: TopicType;
};
