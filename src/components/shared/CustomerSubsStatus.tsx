import { getSubscription } from "@/api/subscriptionApi";
import { getInvoices } from "@/api/invoiceApi";
import { useEffect, useState } from "react";
import { getDaysBeforeDue, isInvoiceDueToday, isInvoiceOverdue } from '@/utils/date';
import Badge from "../ui/badge/Badge";
import { HiExclamation, HiOutlineExclamation } from "react-icons/hi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { format } from "date-fns";

type props = {
  customerId: string;
}

const CustomerSubsStatus = (props: props) => {
  const { customerId } = props;

  const [subs, setSubs] = useState<any>();
  const [invoices, setInvoices] = useState<any[]>();
  const [invoice, setInvoice] = useState<any>();

  const getSubs = async (customerId: string) => {
    const res = await getSubscription(customerId);
    if (res?.data && res?.data?.id) {
      setSubs(res.data)
      getInvoiceList(res?.data?.id)
    }
  }

  const getInvoiceList = async (subscriptionId: string) => {
    const { data } = await getInvoices(subscriptionId);
    if (data && data?.length) {
      const list = data;
      console.log(data, "<=== subs list")
      setInvoices(list);
      
      if (data?.length === 1) {
        const todayInvoice = list.reduce((acc: any, item: any) => {
          const find = format(new Date(), 'yyyy-MM') === format(item.invoiceDate, 'yyyy-MM');
          if (find) {
            acc = item;
          }
          return acc;
        }, {});

        console.log(todayInvoice, "<=== todayInvoice")
        setInvoice(todayInvoice);
      }
    }
    // if (res?.data) setInvoice(res.data);
  }

  useEffect(() => {
    getSubs(customerId)
  }, [customerId])

  if (!subs?.id) return null;

  if (invoices && invoices?.length > 1) {
    return (
      <Badge variant="solid" color="error" startIcon={<HiExclamation />}>
        {invoices?.length} Months Overdue
      </Badge>
    );
  }

  return (
    <>
      { invoice?.dueDate &&
        (
          <div data-tooltip-id="subs-status-tooltip">
            {
              getDaysBeforeDue(invoice.dueDate) && (
                <Badge variant="light" color="warning" startIcon={<HiOutlineExclamation />}>
                  {getDaysBeforeDue(invoice.dueDate)}
                </Badge>
              )
            }
            {
              isInvoiceDueToday(invoice.dueDate) &&  (
                <Badge variant="solid" color="warning" startIcon={<HiExclamation />}>
                  Due Today
                </Badge>
              )
            }
            {
              isInvoiceOverdue(invoice.dueDate) &&  (
                <Badge variant="solid" color="error" startIcon={<HiExclamation />}>
                  Overdue
                </Badge>
              )
            }
            <ReactTooltip
              id="subs-status-tooltip"
              place="top"
              content={`Due Date: ${format(invoice.dueDate, 'MMM d, yyyy')}`}
            />
          </div>
        )
      }
    </>
  )
}

export default CustomerSubsStatus;