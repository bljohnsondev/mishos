import { ToastMessage } from '@/types';

import { getStorageValue, setStorageValue } from './storage';

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

export const setTheme = (theme: string) => {
  if (theme === 'light') {
    document.firstElementChild?.classList.remove('sl-theme-dark');
    setStorageValue('theme', 'light');
  } else {
    document.firstElementChild?.classList.add('sl-theme-dark');
    setStorageValue('theme', 'dark');
  }
};

export const getTheme = () => {
  const theme = getStorageValue('theme');

  if (!theme) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!prefersDark) {
      return 'light';
    } else {
      return 'dark';
    }
  } else {
    return theme;
  }
};

export * from './date-utils';
export * from './form-handler';
export * from './storage';
