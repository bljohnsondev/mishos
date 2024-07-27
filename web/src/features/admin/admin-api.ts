import { kyWrapper } from '@/lib/ky-wrapper';
import type { UserDto } from '@/types';

export const getUsers = async (): Promise<UserDto[]> => {
  const json: any = await kyWrapper.get('admin/users').json();
  return json.users ? (json.users as UserDto[]) : [];
};

export const saveUser = async (user: UserDto): Promise<UserDto | undefined> => {
  const json: any = await kyWrapper.post('admin/user/save', { json: user }).json();
  return json.user as UserDto;
};

export const deleteUser = async (userId: number): Promise<string> => {
  const json: any = await kyWrapper.post('admin/user/del', { json: { id: userId } }).json();
  return json.message;
};
