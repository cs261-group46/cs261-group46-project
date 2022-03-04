interface PlanOfAction {
    id: string;
    title: string;
    status: "active" | "completed";
    clientOnly?: boolean
}