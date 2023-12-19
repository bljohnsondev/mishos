import { axios } from '@/lib/axios';
import { UserDto } from '@/types';

interface LoginResponse {
  user?: UserDto;
  token?: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  return await axios.post('/auth/login', {
    username,
    password,
  });
};
