import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ProductsComponent from "./ProductsComponent";

export const metadata: Metadata = {
  title: "Products Page | New World Computer Center",
  description: "This is Product List Page of New World Computer Center",
};

export interface Product {
  id?: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  isActive: boolean;
}

export default function ProductPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Products" />
      <ProductsComponent />
    </div>
  );
}