import { kyWrapper } from '@/lib/ky-wrapper';
import { UserConfigDto } from '@/types';

export const saveConfig = async (config: UserConfigDto) => {
  await kyWrapper
    .post('init/saveconfig', {
      json: {
        userConfig: config,
      },
    })
    .json();
};
