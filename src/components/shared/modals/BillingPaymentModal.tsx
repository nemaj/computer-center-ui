import { getCustomers } from "@/api/customerApi";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import AsyncSelect from "react-select/async";

type props = {
  isOpen: boolean,
  closeModal: () => void
}

const BillingPaymentModal = (props: props) => {
  const {isOpen, closeModal} = props;

  const currentDate = new Date();

  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<any>(currentDate.getMonth()+1);
  const [year, setYear] = useState<any>(currentDate.getFullYear());
  const [amount, setAmount] = useState<any>();

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const loadOptions = async (inputValue: string) => {
    const response = await getCustomers(1, inputValue);

    return (response?.data?.customers ?? []).map((user: any) => ({
      label: `${user?.firstName} ${user.lastName} - ${user?.address}`,
      value: user.id,
    }));
  };

  const onSubmit = () => {
    console.log(selectedOption)
    console.log(selectedMonth)
    console.log(year)
    console.log(amount)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Monthly Bill Payment
          </h5>
        </div>
        <div className="mt-8">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Biller
            </label>
            <div className="relative">
              <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                placeholder="Search here..."
                onChange={(select: any) => setSelectedOption(select.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Month
                </label>
                <Select
                  placeholder="Select Month"
                  options={monthOptions}
                  defaultValue={selectedMonth}
                  onChange={(select) => setSelectedMonth(select)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Year
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Amount
              </label>
              <NumericFormat
                id="amount"
                name="amount"
                customInput={Input}
                prefix="₱ "
                thousandSeparator=","
                decimalSeparator="."
                allowNegative={false}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
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
            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            Submit Payment
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BillingPaymentModal;