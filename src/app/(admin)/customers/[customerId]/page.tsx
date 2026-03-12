import { Metadata } from "next";
import CustomerFormComponent from "./CustomerFormComponent";

export const metadata: Metadata = {
  title: "Customer Form Page | New World Computer Center",
  description: "This is Customer Form Page of New World Computer Center",
};

export default function CustomerFormPage() {
  return (
    <div>
      <CustomerFormComponent />
    </div>
  );
}
