import { axios } from '@/lib/axios';
import { TaskDto } from '@/types';

export const getTasks = async (): Promise<TaskDto[] | undefined> => {
  const tasks: TaskDto[] | undefined = await axios.get('/tasks');
  return tasks;
};
