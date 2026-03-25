import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearToast } from "@/store/slices/notificationSlice";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const Notification = () => {
  const dispatch = useAppDispatch()
  const message = useAppSelector((state) => state.notification.message)

  useEffect(() => {
    if (!message) return;
    toast.success(message)
    const timer = setTimeout(() => {
      dispatch(clearToast())
    }, 250)

    return () => clearTimeout(timer);
  }, [message])

  return <Toaster />;
}

export default Notification;