import { Transition } from '@headlessui/react';
import { Toaster, ToastIcon, resolveValue } from 'react-hot-toast';

export const ToastMessage = () => {
  return (
    <Toaster position="top-center">
      {toast => (
        <Transition
          appear
          show={toast.visible}
          className="transform p-4 flex bg-white rounded shadow-lg"
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <ToastIcon toast={toast} />
          <p className="px-2">{resolveValue(toast.message, toast)}</p>
        </Transition>
      )}
    </Toaster>
  );
};
