'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Head from "next/head";
import Link from "next/link";
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { getCustomer } from '@/api/customerApi';
import { Customer } from "../page";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

export default function CustomerFormPage() {
  const {customerId} = useParams();
  const [customerData, setCustomerData] = useState<Customer>()

  console.log(customerId, "<=== params");

  const getInfo = async (id: any) => {
    const res = await getCustomer(id);

    console.log(res, '<==== customer data');
    if (res?.data) setCustomerData(res.data);
  };

  useEffect(() => {
    if (customerId) getInfo(customerId)
  }, [customerId])

  return (
    <div>
      <Head>
        <title>Customer Form Page | New World Computer Center</title>
        <meta
          name="description"
          content="This is Customer Form Page of New World Computer Center."
        ></meta>
      </Head>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {customerData?.firstName} {customerData?.lastName} Details
        </h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                href="/"
              >
                Home
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                href="/customers"
              >
                Customers
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">
              {customerData?.firstName} {customerData?.lastName}
            </li>
          </ol>
        </nav>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label>First Name</Label>
            <Input type="text" defaultValue={customerData?.firstName ?? ''} />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input type="text" defaultValue={customerData?.lastName ?? ''} />
          </div>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label>Middle Name</Label>
              <Input type="text" defaultValue={customerData?.middleName ?? ''} />
            </div><div>
              <Label>Due Date</Label>
              <Input type="text" defaultValue={customerData?.dueDate ?? ''} />
            </div>
          </div>
          <div>
            <Label>Account Number</Label>
            <Input type="text" defaultValue={customerData?.accountNumber ?? ''} />
          </div>
        </div>
        <div className="mb-6">
          <Label>Address</Label>
          <Input type="text" defaultValue={customerData?.address ?? ''} />
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label>Contact</Label>
            <Input type="text" defaultValue={customerData?.contact ?? ''} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label>Monthly Payment/Amount</Label>
              <Input type="text" defaultValue={customerData?.monthlyAmount ?? ''} />
            </div><div>
              <Label>Balance</Label>
              <Input type="text" defaultValue={customerData?.balance ?? ''} />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Button size="sm" variant="primary">
            { customerId ? 'Update' : 'Save' }
          </Button>
        </div>
      </div>
    </div>
  );
}
