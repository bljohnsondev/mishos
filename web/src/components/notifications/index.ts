import { toast } from 'react-hot-toast';

export const showSuccess = (message: string) => toast.success(message);
export const showError = (message: string) => toast.error(message);

// react-hot-toast doesn't currently support warn and info, unfortunately
export const showWarning = (message: string) => toast.error(message);

export * from './toast-message';
