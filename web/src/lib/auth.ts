import { getUser, login as apiLogin } from '@/features/auth';
import { UserDto } from '@/types';
import { storage } from '@/utils/storage';

export const hasToken = (): boolean => {
  return !!storage.getToken();
};

export const loadUser = async () => {
  if (storage.getToken()) {
    try {
      return await getUser();
    } catch (ex) {
      return null;
    }
  }

  return null;
};

export const login = async (username: string, password: string): Promise<UserDto> => {
  const response = await apiLogin(username, password);

  if (response && response.user && response.token) {
    storage.setToken(response.token);
    return response.user;
  } else throw new Error('Authentication failed');
};

export const logout = async () => {
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
};
