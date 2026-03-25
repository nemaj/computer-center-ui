import { getCustomers } from "@/api/customerApi";
import { getInvoices } from "@/api/invoiceApi";
import { getSubscription } from "@/api/subscriptionApi";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { unformatCurrency } from "@/utils/formatter";
import classNames from "classnames";
import { format } from "date-fns";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import AsyncSelect from "react-select/async";
import { createPayments } from '@/api/paymentApi';
import { useAppDispatch } from "@/store/hooks";
import { setCustomerRefresh, setCustomerTableData } from "@/store/slices/customerSlice";
import { setNotificationMessage } from "@/store/slices/notificationSlice";

type props = {
  isOpen: boolean,
  closeModal: () => void
}

const BillingPaymentModal = (props: props) => {
  const {isOpen, closeModal} = props;

  const dispatch = useAppDispatch()

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [amount, setAmount] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const hasError = () => {
    return !amount ||
      unformatCurrency(amount) > selectedInvoice?.totalAmount ||
      !selectedInvoice?.id ||
      false;
  }

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];
  
    const response = await getCustomers(1, inputValue);

    return (response?.data?.customers ?? []).map((user: any) => ({
      label: `${user?.firstName} ${user.lastName} - ${user?.address}`,
      value: user.id,
    }));
  };

  const handleSelectCustomer = async (selected: any) => {
    try {
      setLoading(true);
      setSelectedCustomer(selected)
      setSelectedInvoice(null);
      const { data: subs } = await getSubscription(selected?.value);
      if (subs?.id) {
        const {data: list} = await getInvoices(subs.id);
        handleInvoiceList(list)
      } else {
        setInvoices([])
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalPayments = (payments: any) => {
    if (!payments || !payments?.length) return 0;
    return payments.reduce((acc: number, item: any) => {
      return (acc + item.amountPaid)
    }, 0)
  }

  const handleInvoiceList = (invoiceList: any) => {
    if (!invoiceList || !invoiceList?.length) {
      setSelectedInvoice(null);
      setInvoices([])
      return;
    }
    const list = invoiceList.reduce((acc: any, item: any) => {
      const totalAmount = item.payments?.length ? item.totalAmount - totalPayments(item.payments) : item.totalAmount;
      const invoice = {
        ...item,
        totalAmount
      }
      return [ ...acc, invoice ];
    }, []);

    setSelectedInvoice(list[list.length -1 ]);
    setInvoices(list)
  }

  const onSubmit = async () => {
    if (hasError()) return;
    try {
      dispatch(setCustomerRefresh(true));
      const data = {
        invoiceId: selectedInvoice.id,
        amountPaid: unformatCurrency(amount),
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        status: unformatCurrency(amount) === Number(selectedInvoice.totalAmount) ? 'paid' : 'partially_paid'
      }

      const res = await createPayments(data);
      if (res.status === 201) {
        const { data } = await getCustomers(1);
        if (data) {
          dispatch(setCustomerTableData(data));
          dispatch(setCustomerRefresh(false));
          dispatch(setNotificationMessage('Payment Posted!'))
          handleClose();
        }
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => {
    setSelectedCustomer(null);
    setSelectedInvoice(null);
    setInvoices(null);
    setAmount(null);
    closeModal?.();
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
            Monthly Bill Payment
          </h5>
        </div>
        <div className="mt-8">
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Biller
            </label>
            <div className="relative">
              <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                placeholder="Search here..."
                defaultValue={selectedCustomer}
                onChange={handleSelectCustomer}
              />
            </div>
          </div>

          {loading && <>Loading...</>}

          {!loading && invoices && invoices?.length !== 0 ?
            (
              <>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Please select:
                </label>
                <div className="flex flex-wrap gap-[10px]">
                  {
                    invoices?.map((_invoice: any) => (
                      <div
                        className={classNames(
                          "border rounded-md p-4",
                          _invoice.id === selectedInvoice?.id && "border-brand-500 hover:border-brand-500 bg-brand-500 hover:bg-brand-500 text-white",
                        )}
                        key={_invoice.id}
                      >
                        <p className="text-center text-lg">{format(_invoice.dueDate, 'MMMM')}</p>
                        <p className="text-center text-xs">
                          Amount:{' '}
                          <NumericFormat
                            className="text-sm"
                            value={_invoice.totalAmount}
                            displayType="text"
                            prefix="₱ "
                            thousandSeparator=","
                          />
                        </p>
                      </div>
                    ))
                  }
                </div>

                <div className="grid gap-6 md:grid-cols-2 mt-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Amount{" "}
                      {selectedInvoice?.totalAmount && (
                        <>
                          (<NumericFormat
                            className="text-sm"
                            value={selectedInvoice.totalAmount}
                            displayType="text"
                            prefix="₱ "
                            thousandSeparator=","
                          />)
                        </>
                      )}
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
                      disabled={!selectedInvoice?.id}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : invoices !== null ? (
              <p className="text-sm text-error-500 ml-2">No invoice found.</p>
            ) : (<></>)
          }
        </div>
        <div className="flex items-center gap-3 mt-10 modal-footer sm:justify-end">
          <button
            onClick={handleClose}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Close
          </button>
          <button
            onClick={onSubmit}
            type="button"
            disabled={hasError()}
            className={classNames(
              "btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto",
              hasError() && "cursor-not-allowed opacity-50"
            )}
          >
            Submit Payment
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BillingPaymentModal;