import { clearToken } from '@/utils';

export const logout = async () => {
  clearToken();
  window.location.assign(window.location.origin as unknown as string);
};
