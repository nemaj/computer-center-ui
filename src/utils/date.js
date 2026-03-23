import { differenceInDays, format, isBefore, isToday, parseISO } from "date-fns";

export const isInvoiceOverdue = (dueDate) => {
  const today = parseISO(format(new Date(), 'yyyy-MM-dd'));
  const parsedDueDate = parseISO(dueDate);

  return isBefore(parsedDueDate, today);
};

export const isInvoiceDueToday = (dueDate) => {
  const parsedDate = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;

  return isToday(parsedDate);
};

export const getDaysBeforeDue = (dueDate) => {
  const today = parseISO(format(new Date(), 'yyyy-MM-dd'));
  const parsedDueDate = parseISO(dueDate);

  const diff = differenceInDays(parsedDueDate, today);

  if (diff === 1) return `Due Tomorrow`;
  if (diff >= 2 && diff <= 3) {
    return `Due in ${diff} Days`;
  }
  return '';
};