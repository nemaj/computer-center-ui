import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomersComponent from "./CustomersComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Page | New World Computer Center",
  description: "This is Customer List Page of New World Computer Center",
};

export interface Customer {
  id?: string;
  accountNumber: string;
  lastName: string;
  firstName: string;
  middleName: string| null;
  address: string;
  contact: string;
  dueDate: string;
}

export default function CustomerPage() {
  return (
    <>
      <div>
        <PageBreadcrumb pageTitle="Customers" />
        <CustomersComponent />
      </div>
    </>
  );
}
