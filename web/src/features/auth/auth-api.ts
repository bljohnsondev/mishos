import ky from 'ky';

import { UserDto } from '@/types';

export interface LoginResponse {
  user?: UserDto;
  token?: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  return await ky
    .post('http://localhost:3000/api/auth/login', {
      json: { username, password },
    })
    .json();
};

export const getUser = async (): Promise<UserDto | undefined> => {
  return await ky.get('/auth/user').json();
};
