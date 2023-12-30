import ky from 'ky';

import { UserDto } from '@/types';

export interface LoginResponse {
  user?: UserDto;
  token?: string;
}

const LOGIN_API = import.meta.env.VITE_API_URL;

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  return await ky
    .post(`${LOGIN_API}/auth/login`, {
      json: { username, password },
    })
    .json();
};

export const getUser = async (): Promise<UserDto | undefined> => {
  return await ky.get('/auth/user').json();
};
