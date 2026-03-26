import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { createProduct, getProduct, getProducts, updateProduct } from "@/api/productApi";
import { getTransactions } from "@/api/inventoryTransactionApi";
import { generateSku, unformatCurrency } from "@/utils/formatter";
import { Product } from "@/app/(admin)/products/page";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import { Controller, FormProvider, useForm } from "react-hook-form";
import classNames from "classnames";
import { NumericFormat } from "react-number-format";
import { useAppDispatch } from "@/store/hooks";
import { setNotificationMessage } from "@/store/slices/notificationSlice";

type props = {
  product: Product,
  isOpen: boolean,
  closeModal: (refresh: boolean) => void
}

const ProductFormModal = (props: props) => {
  const { product, isOpen, closeModal } = props;

  const dispatch = useAppDispatch();

  const productId = product.id || 'new';

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Product>({
    defaultValues: {
      name: "",
      price: null,
      cost: null,
      isActive: true
    },
  });

  useEffect(() => {
    if (product.name) {
      reset(product)
    }
  }, [product])

  const onSubmit = async (data: any) => {
    console.log(data, '<== onSubmit')
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    const postData = {
      ...data,
      sku: generateSku(data.name),
      price: unformatCurrency(data.price),
      cost: unformatCurrency(data.cost),
    }

    if (productId === 'new') {
      const res = await createProduct(postData);
      if (res?.status === 201) {
        dispatch(setNotificationMessage('Product Created!'));
        handleClose(true);
      }
    } else {
      const res = await updateProduct(productId, postData);
      if (res?.status === 200) {
        dispatch(setNotificationMessage('Product Updated!'));
        handleClose(true);
      }
    }
  }

  const handleClose = async (refresh = false) => {
    closeModal?.(refresh)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-visible">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {product?.id === 'new' ? 'New Product' : product?.name} Form
          </h5>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-8">
            <div className="mb-6">
              <Label>Product Name</Label>
              <Input
                type="text"
                defaultValue={product?.name ?? ''}
                {...register("name", { required: "Product Name is required" })}
                hasError={!!errors?.name?.message}
                hint={errors?.name?.message}
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <Label>Product Price</Label>
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
              <div>
                <Label>Product Cost</Label>
                <Controller
                  name="cost"
                  control={control}
                  rules={{
                    required: "Cost is required",
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
                      hasError={!!errors?.cost?.message}
                      hint={errors?.cost?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      label="Is Active"
                      checked={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-10 modal-footer sm:justify-end">
            <button
              onClick={() => handleClose()}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            <button
              type="submit"
              className={classNames(
                "btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto",
              )}
            >
              {product?.id !== 'new' ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ProductFormModal;