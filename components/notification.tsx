import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const triggerNotification = (content: string) => toast(content)

export default function Notification() {
  return <ToastContainer />
}