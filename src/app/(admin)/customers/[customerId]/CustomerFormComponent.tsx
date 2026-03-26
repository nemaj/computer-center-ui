'use client';

import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from "react";
import { getCustomer, createCustomer, updateCustomer } from '@/api/customerApi';
import { Customer } from "../page";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { HiOutlineTrash } from "react-icons/hi";
import { TbCalendarDollar } from "react-icons/tb";
import SubscriptionModal from "@/components/shared/modals/SubscriptionModal";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAppDispatch } from "@/store/hooks";
import { setConfirmationModal, setNotificationMessage } from "@/store/slices/notificationSlice";
import { useForm } from "react-hook-form";

export default function CustomerFormComponent() {
  const router = useRouter();
  const {customerId} = useParams();
  const formRef = useRef(null);
  const dispatch = useAppDispatch();
  
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      lastName: "",
      firstName: "",
      middleName: "",
      accountNumber: "",
      address: "",
      contact: "",
    },
  });

  const [openSubscription, setOpenSubscription] = useState(false);
  const [customer, setCustomer] = useState<Customer>();

  const getInfo = async (id: any) => {
    const res = await getCustomer(id);

    if (res?.data) {
      reset(res.data);
      setCustomer(res.data);
    }
  };

  useEffect(() => {
    if (customerId && customerId !== 'new') getInfo(customerId)
  }, [customerId])

  const onSubmit = async (data: any) => {
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    if (customerId === 'new') {
      const res = await createCustomer(data);
      if (res?.status === 201) {
        dispatch(setNotificationMessage('Customer Created!'))
        router.push('/customers');
      }
    } else {
      const res = await updateCustomer(customerId, data);
      if (res?.status === 200) {
        dispatch(setNotificationMessage('Customer Updated!'))
        router.push('/customers');
      }
    }
  }
  
  const openConfirmation = () => {
    dispatch(setConfirmationModal({
      selectedId: String(customerId),
      label: `Are you sure you want to delete ${getValues('accountNumber')}?`,
      description: `This action cannot be undone.`,
      type: 'CUSTOMER'
    }))
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90 capitalize flex items-center gap-[10px]"
          x-text="pageName"
        >
          {customerId === 'new' ? `New Customer Details` : `${getValues('firstName').toLowerCase()} ${getValues('lastName').toLowerCase()} Details`}
          <TbCalendarDollar size={25} className="cursor-pointer hover:text-blue-600" onClick={() => setOpenSubscription(true)} data-tooltip-id="subs-tooltip" />
        </h2>
        <ReactTooltip
          id="subs-tooltip"
          place="right"
          content="Subscription Details"
        />
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
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:underline"
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
              {customerId === 'new' ? `New Customer` : `${getValues('firstName')} ${getValues('lastName')}`}
            </li>
          </ol>
        </nav>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                type="text"
                id="firstName"
                {...register("firstName", { required: "First name is required" })}
                hasError={!!errors?.firstName?.message}
                hint={errors?.firstName?.message}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                type="text"
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                hasError={!!errors?.lastName?.message}
                hint={errors?.lastName?.message}
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Middle Name</Label>
                <Input
                  type="text"
                  id="middleName"
                  {...register("middleName", {})}
                />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Account Number</Label>
                <Input
                  type="text"
                  id="accountNumber"
                  {...register("accountNumber", { required: "Account Number is required" })}
                  hasError={!!errors?.accountNumber?.message}
                  hint={errors?.accountNumber?.message}
                />
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  type="text"
                  id="contact"
                  {...register("contact", {})}
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <Label>Address</Label>
            <Input
              type="text"
              id="address"
              {...register("address", {})}
            />
          </div>
          <div className="flex justify-between mt-10">
            <Button
              type="submit"
              size="sm"
              variant="primary">
                { customerId !== 'new' ? 'Update' : 'Save' }
            </Button>
            {customerId !== 'new' && <Button size="sm" variant="danger" onClick={openConfirmation}>
              <HiOutlineTrash size={18} />
            </Button>}
          </div>
        </form>
        {customer?.id && <SubscriptionModal customer={customer} isOpen={openSubscription} closeModal={() => setOpenSubscription(false)} />}
      </div>
    </>
  )
}