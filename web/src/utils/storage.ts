const storagePrefix = 'mishos_';

export const getStorageValue = (key: string) => {
  return JSON.parse(window.localStorage.getItem(`${storagePrefix}${key}`) as string);
};

export const setStorageValue = (key: string, value: string) => {
  window.localStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(value));
};

export const clearStorageValue = (key: string) => {
  window.localStorage.removeItem(`${storagePrefix}${key}`);
};

export const getToken = () => {
  return getStorageValue('token');
};

export const setToken = (token: string) => {
  setStorageValue('token', token);
};

export const clearToken = () => {
  clearStorageValue('token');
};
