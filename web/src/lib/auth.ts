import { storage } from '@/utils';

export const logout = async () => {
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
};
