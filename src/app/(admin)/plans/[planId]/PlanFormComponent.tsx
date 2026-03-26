'use client';

import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { HiOutlineTrash } from "react-icons/hi";
import { NumericFormat } from "react-number-format";
import { unformatCurrency } from "@/utils/formatter";
import { createPlan, getPlan, updatePlan } from "@/api/planApi";
import { useAppDispatch } from "@/store/hooks";
import { setConfirmationModal, setNotificationMessage } from "@/store/slices/notificationSlice";
import { Controller, useForm } from "react-hook-form";

export default function PlanFormComponent() {
  const router = useRouter();
  const { planId } = useParams();
  const formRef = useRef(null);
  const dispatch = useAppDispatch();
  
  const {
    getValues,
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      planName: "",
      price: null,
      description: "",
    },
  });

  const getInfo = async (id: any) => {
    const res = await getPlan(id);

    if (res?.data) {
      reset(res.data)
    };
  };

  useEffect(() => {
    if (planId && planId !== 'new') getInfo(planId)
  }, [planId])

  const onSubmit = async (data: any) => {
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    const postData = {
      ...data,
      price: unformatCurrency(data.price)
    }

    if (planId === 'new') {
      const res = await createPlan(postData);
      if (res?.status === 201) {
        dispatch(setNotificationMessage('Plan Created!'))
        router.push('/plans');
      }
    } else {
      const res = await updatePlan(planId, postData);
      if (res?.status === 200) {
        dispatch(setNotificationMessage('Plan Updated!'))
        router.push('/plans');
      }
    }
  }

  const openConfirmation = () => {
    dispatch(setConfirmationModal({
      selectedId: String(planId),
      label: `Are you sure you want to delete ${getValues('planName')} Plan?`,
      description: `This action cannot be undone.`,
      type: 'PLAN'
    }))
  }

  return (
    <>
      
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {planId === 'new' ? `New Plan Details` : `${getValues('planName')} Details`}
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
              {planId === 'new' ? `New Customer` : `${getValues('planName')}`}
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
              <Label>Plan Name</Label>
              <Input
                type="text"
                id="planName"
                {...register("planName", { required: "Plan Name is required" })}
                hasError={!!errors?.planName?.message}
                hint={errors?.planName?.message}
              />
            </div>
            <div>
              <Label>Price</Label>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Price is required",
                }}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    prefix="₱ "
                    thousandSeparator=","
                    decimalSeparator="."
                    onValueChange={(values) => {
                      field.onChange(values.value); // 🔑 important
                    }}
                    hasError={!!errors?.price?.message}
                    hint={errors?.price?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className="mb-6">
            <Label>Description</Label>
            <Input
              type="text"
              id="description"
              {...register("description", {})}
            />
          </div>
          <div className="flex justify-between mt-10">
            <Button
              type="submit"
              size="sm"
              variant="primary">
                { planId !== 'new' ? 'Update' : 'Save' }
            </Button>
            {planId !== 'new' && <Button size="sm" variant="danger" onClick={openConfirmation}>
              <HiOutlineTrash size={18} />
            </Button>}
          </div>
        </form>
      </div>
    </>
  )
}