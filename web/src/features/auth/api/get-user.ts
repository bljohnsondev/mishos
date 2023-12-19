import { axios } from '@/lib/axios';
import { UserDto } from '@/types';

export const getUser = async (): Promise<UserDto | undefined> => {
  return await axios.get('/auth/user');
};
