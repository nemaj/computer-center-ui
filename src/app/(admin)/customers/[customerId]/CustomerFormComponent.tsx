'use client';

import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from "react";
import { getCustomer, createUser, updateUser } from '@/api/customerApi';
import { Customer } from "../page";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { HiOutlineTrash } from "react-icons/hi";
import toast, { Toaster } from 'react-hot-toast'
import { TbCalendarDollar } from "react-icons/tb";

const init = {
  id: 'new',
  accountNumber: "",
  dueDate: '',
  lastName: '',
  firstName: '',
  middleName: '',
  address: '',
  contact: '',
}

export default function CustomerFormComponent() {
  const router = useRouter();
  const {customerId} = useParams();
  const formRef = useRef(null);

  const [customerData, setCustomerData] = useState<Customer>(init)
  const [errors, setErrors] = useState<Customer>({} as Customer);

  const getInfo = async (id: any) => {
    const res = await getCustomer(id);

    if (res?.data) setCustomerData(res.data);
  };

  useEffect(() => {
    if (customerId && customerId !== 'new') getInfo(customerId)
  }, [customerId])

  const handleOnChange = (key: string, value: string) => {
    const formValues = {
      ...customerData,
      [key]: value,
    };
    setCustomerData(formValues);
  };

  // Validate inputs
  const validate = () => {
    const newErrors: Customer = {} as Customer;
    if (!customerData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!customerData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!customerData.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    }
    if (!customerData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (parseInt(customerData.dueDate) > 0 && parseInt(customerData.dueDate) > 31) {
      newErrors.dueDate = "Due date should the day of the Month (1 - 31)";
    }

    return newErrors;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const data = {...customerData};
      delete data.id;

      if (customerId === 'new') {
        const res = await createUser(data);
        if (res?.status === 201) {
          toast.success("Customer Created!")
          router.push('/customers');
        }
      } else {
        const res = await updateUser(customerId, data);
        if (res?.status === 200) {
          toast.success("Customer Updated!")
          router.push('/customers');
        }
      }
    } else {
      setErrors(validationErrors);
    }
  }

  if (!customerData?.accountNumber) return <></>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90 capitalize flex items-center gap-[10px]"
          x-text="pageName"
        >
          {customerId === 'new' ? `New Customer Details` : `${customerData?.firstName.toLowerCase()} ${customerData?.lastName.toLowerCase()} Details`}
          {/* <Button size="sm" variant="outline" className="relative ml-4"> */}
            <TbCalendarDollar size={25} className="cursor-pointer hover:text-blue-600"/>
          {/* </Button> */}
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
              {customerId === 'new' ? `New Customer` : `${customerData?.firstName} ${customerData?.lastName}`}
            </li>
          </ol>
        </nav>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <form
          ref={formRef}
          onSubmit={onSubmit}
        >
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                defaultValue={customerData?.firstName ?? ''}
                onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                error={!!errors?.firstName}
              />
              {errors?.firstName && <span className="text-[12px] text-error-500 ml-2">{errors?.firstName}</span>}
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                defaultValue={customerData?.lastName ?? ''}
                onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                error={!!errors?.lastName}
              />
              {errors?.lastName && <span className="text-[12px] text-error-500 ml-2">{errors?.lastName}</span>}
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Middle Name</Label>
                <Input
                  type="text"
                  id="middleName"
                  name="middleName"
                  defaultValue={customerData?.middleName ?? ''}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                />
              </div><div>
                <Label>Due Date <span className="text-[12px] italic">(Day of the Month)</span></Label>
                <Input
                  type="text"
                  id="dueDate"
                  name="dueDate"
                  placeholder="1 - 31"
                  defaultValue={customerData?.dueDate ?? ''}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                  error={!!errors?.dueDate}
                />
                {errors?.dueDate && <span className="text-[12px] text-error-500 ml-2">{errors?.dueDate}</span>}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Account Number</Label>
                <Input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  defaultValue={customerData?.accountNumber ?? ''}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                  error={!!errors?.accountNumber}
                />
                {errors?.accountNumber && <span className="text-[12px] text-error-500 ml-2">{errors?.accountNumber}</span>}
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  type="text"
                  id="contact"
                  name="contact"
                  defaultValue={customerData?.contact ?? ''}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <Label>Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              defaultValue={customerData?.address ?? ''}
              onChange={(e) => handleOnChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-10">
            <Button
              type="submit"
              size="sm"
              variant="primary">
                { customerId !== 'new' ? 'Update' : 'Save' }
            </Button>
            {customerId !== 'new' && <Button size="sm" variant="danger">
              <HiOutlineTrash size={18} />
            </Button>}
          </div>
        </form>
        <Toaster />
      </div>
    </>
  )
}