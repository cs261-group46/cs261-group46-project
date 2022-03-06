interface PlanOfAction {
  id: number;
  title: string;
  status: "active" | "completed";
  clientOnly?: boolean;
}
