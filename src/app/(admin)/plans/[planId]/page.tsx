import { Metadata } from "next";
import PlanFormComponent from "./PlanFormComponent";

export const metadata: Metadata = {
  title: "Plan Form Page | New World Computer Center",
  description: "This is Plan Form Page of New World Computer Center",
};

export default function PlanFormPage() {
  return (
    <div>
      <PlanFormComponent />
    </div>
  );
}
