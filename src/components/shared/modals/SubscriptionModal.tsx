import { createSubscription, getSubscription, updateSubscription } from "@/api/subscriptionApi";
import { getPlans } from "@/api/planApi";
import { Customer } from "@/app/(admin)/customers/page";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Plan } from "@/app/(admin)/plans/page";
import classNames from "classnames";
import DatePicker from "@/components/form/date-picker";
import { format } from "date-fns";

type props = {
  customer: Customer,
  isOpen: boolean,
  closeModal: () => void
}

const SubscriptionModal = (props: props) => {
  const { customer, isOpen, closeModal } = props;

  const currentDate = new Date();

  const [plans, setPlans] = useState<Plan[]>();
  const [subscription, setSubscription] = useState<any>();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [startDate, setStartDate] = useState<any>(currentDate);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const getPlanList = async () => {
    const res = await getPlans();
    console.log(res, '<=== plans')
    if (res?.data) setPlans(res?.data);
  }

  const getInfo = async (customerId: string) => {
    getPlanList();
    const res = await getSubscription(customerId);
    console.log(res, '<=== response subscription');
    if (res?.data?.id) {
      setSubscription(res?.data);
      setSelectedPlan(res?.data?.planId)
      setStartDate(res?.data?.startDate)
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    if (!customer?.id || customer?.id === 'new') return;
    getInfo(customer?.id ?? '');
  }, [customer, isOpen])

  const onSubmit = async () => {
    const data = {
      customerId: customer.id,
      planId: selectedPlan,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: null,
      status: 'active'
    };
    console.log(data, "<== onSubmit Subscription");

    let response = null;
    if (subscription?.id) {
      response = await updateSubscription(subscription.id, data);
    } else {
      response = await createSubscription(data);
    }
    console.log(response, "<== saved");
    if (response?.status === 201 || response?.status === 200) {
      closeModal();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-visible">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Subscription for <span className="capitalize">{`${customer?.firstName.toLowerCase()} ${customer.lastName.toLowerCase()}`}</span>
          </h5>
        </div>
        <div className="mt-8">
          <div>
            <DatePicker id="startDate" label="Start Date" defaultDate={startDate} onChange={(e) => setStartDate(e)} disabled={!!subscription?.id} />
          </div>
          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Plans
            </label>
            <div className="grid gap-6 grid-cols-4">
              {
                (plans || []).map((plan) => (
                  <div
                    className={classNames(
                      "cursor-pointer h-[100px] rounded-lg border-2 flex flex-col items-center justify-center",
                      plan.id === selectedPlan && "border-brand-500 hover:border-brand-500 bg-brand-500 hover:bg-brand-500 text-white",
                      plan.id !== selectedPlan && "hover:border-gray-300 hover:bg-gray-100"
                    )}
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setHasChanges(true);
                    }}
                  >
                    <span className="block font-medium text-xl">{plan.planName}</span>
                    <span>(<NumericFormat
                      className="text-center text-sm"
                      value={plan.price}
                      displayType="text"
                      prefix="₱ "
                      thousandSeparator=","
                    />)</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-10 modal-footer sm:justify-end">
          <button
            onClick={closeModal}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Close
          </button>
          <button
            onClick={onSubmit}
            type="button"
            disabled={!startDate || !selectedPlan || hasChanges}
            className={classNames(
              "btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto",
              (!startDate || !selectedPlan || !hasChanges) && "cursor-not-allowed opacity-50"
            )}
          >
            {subscription?.id ? 'Update' : 'Subscribe'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SubscriptionModal;