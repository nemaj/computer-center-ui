import { Modal } from "@/components/ui/modal";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeConfirmation, setNotificationMessage } from "@/store/slices/notificationSlice";
import { useRouter } from "next/navigation";
import { deletePlan } from "@/api/planApi";

const ConfirmationModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const confirmation = useAppSelector((state) => state.notification.confirmation)

  const handleClose = () => {
    dispatch(closeConfirmation())
  }

  const onConfirm = async () => {
    if (!confirmation?.type) return;
    
    if (confirmation.type === 'PLAN') {
      try {
        const { data } = await deletePlan(confirmation.selectedId);
        console.log(data, "<=== onDelete");
      } catch (e) {
        console.error(e)
      } finally {
        dispatch(setNotificationMessage('Plan Deleted!'))
        handleClose();
        router.push('/plans');
      }
    }
    
    if (confirmation.type === 'CUSTOMER') {
      try {
        const { data } = await deletePlan(confirmation.selectedId);
        console.log(data, "<=== onDelete");
      } catch (e) {
        console.error(e)
      } finally {
        dispatch(setNotificationMessage('Plan Deleted!'))
        handleClose();
        router.push('/plans');
      }
    }
  }

  return (
    <Modal
      isOpen={confirmation.selectedId && confirmation.type}
      onClose={handleClose}
      showCloseButton={false}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-visible">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {confirmation.label}
          </h5>
        </div>
        {confirmation?.description && (
          <div className="mt-4">
            {confirmation.description}
          </div>
        )}
        <div className="flex items-center gap-3 mt-10 modal-footer sm:justify-end">
          <button
            onClick={handleClose}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Close
          </button>
          <button
            type="button"
            className={classNames(
              "btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto",
            )}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal;