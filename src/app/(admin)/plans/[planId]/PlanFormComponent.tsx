'use client';

import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from "react";
import { Plan } from "../page";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { HiOutlineTrash } from "react-icons/hi";
import { NumericFormat } from "react-number-format";
import { unformatCurrency } from "@/utils/formatter";
import toast, { Toaster } from 'react-hot-toast'
import { createPlan, getPlan, updatePlan } from "@/api/planApi";

const init = {
  id: 'new',
  planName: "",
  price: null,
  description: '',
}

export default function PlanFormComponent() {
  const router = useRouter();
  const {planId} = useParams();
  const formRef = useRef(null);

  const [formData, setFormData] = useState<Plan>(init)
  const [errors, setErrors] = useState<Plan>({} as Plan);

  const getInfo = async (id: any) => {
    const res = await getPlan(id);

    if (res?.data) setFormData(res.data);
  };

  useEffect(() => {
    if (planId && planId !== 'new') getInfo(planId)
  }, [planId])

  const handleOnChange = (key: string, value: string) => {
    const formValues = {
      ...formData,
      [key]: value,
    };
    console.log(formValues)
    setFormData(formValues);
  };

  // Validate inputs
  const validate = () => {
    const newErrors: any = {};
    if (!formData.planName) {
      newErrors.planName = "Plan name is required";
    }
    if (!formData.price) {
      newErrors.price = "Plan price is required";
    }

    return newErrors;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const data = { ...formData, price: unformatCurrency(formData.price) };
      delete data.id;

      if (planId === 'new') {
        const res = await createPlan(data);
        if (res?.status === 201) {
          toast.success("Plan Created!")
          router.push('/plans');
        }
      } else {
        console.log(data, "<=== data")
        const res = await updatePlan(planId, data);
        if (res?.status === 200) {
          toast.success("Plan Updated!")
          router.push('/plans');
        }
      }
    } else {
      setErrors(validationErrors);
    }
  }

  return (
    <>
      
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {planId === 'new' ? `New Plan Details` : `${formData?.planName} Details`}
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
              {planId === 'new' ? `New Customer` : `${formData?.planName}`}
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
              <Label>Plan Name</Label>
              <Input
                type="text"
                id="planName"
                name="planName"
                defaultValue={formData?.planName ?? ''}
                onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                error={!!errors?.planName}
              />
              {errors?.planName && <span className="text-[12px] text-error-500 ml-2">{errors?.planName}</span>}
            </div>
            <div>
              <Label>Price</Label>
              <NumericFormat
                id="price"
                name="price"
                customInput={Input}
                prefix="₱ "
                thousandSeparator=","
                decimalSeparator="."
                allowNegative={false}
                value={formData?.price}
                onChange={(e) => handleOnChange(e.target.name, e.target.value)}
              />
              {errors?.price && <span className="text-[12px] text-error-500 ml-2">{errors?.price}</span>}
            </div>
          </div>
          <div className="mb-6">
            <Label>Description</Label>
            <Input
              type="text"
              id="description"
              name="description"
              defaultValue={formData?.description ?? ''}
              onChange={(e) => handleOnChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-10">
            <Button
              type="submit"
              size="sm"
              variant="primary">
                { planId !== 'new' ? 'Update' : 'Save' }
            </Button>
            {planId !== 'new' && <Button size="sm" variant="danger">
              <HiOutlineTrash size={18} />
            </Button>}
          </div>
        </form>
        <Toaster />
      </div>
    </>
  )
}