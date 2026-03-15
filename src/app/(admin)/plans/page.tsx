import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PlansComponent from "./PlansComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans Page | New World Computer Center",
  description: "This is Plan List Page of New World Computer Center",
};

export interface Plan {
  id?: string;
  planName: string;
  price: number | null;
  description: string;
}

export default function PlanPage() {
  return (
    <>
      <div>
        <PageBreadcrumb pageTitle="Plans" />
        <PlansComponent />
      </div>
    </>
  );
}
