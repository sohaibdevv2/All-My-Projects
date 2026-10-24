import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => (
  <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 bg-blue-100 border-t border-blue-500">
    <div className="flex items-center">
      <InformationCircleIcon className="w-6 h-6 text-blue-500" aria-hidden="true" />
      <span className="ml-2 text-blue-700">{message}</span>
    </div>
    <button
      onClick={onClose}
      className="p-1 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Close alert"
      type="button"
    >
      <XMarkIcon className="w-6 h-6 text-blue-500" aria-hidden="true" />
    </button>
  </div>
);

export default Alert;
