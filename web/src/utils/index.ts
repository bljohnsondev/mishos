import { ToastMessage } from '@/types';

export const createEvent = (name: string, detail?: any): CustomEvent => {
  return new CustomEvent(name, {
    bubbles: true,
    composed: true,
    detail,
  });
};

export const createToastEvent = (toast: ToastMessage) => {
  return createEvent('toast', toast);
};

export * from './date-utils';
export * from './error-handler';
export * from './form-validator';
export * from './storage';
