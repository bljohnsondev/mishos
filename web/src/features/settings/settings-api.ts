import { kyWrapper } from '@/lib/ky-wrapper';
import { UserConfigDto } from '@/types';

export const saveConfigGeneral = async (config: UserConfigDto): Promise<boolean> => {
  await kyWrapper
    .post('init/saveconfig/general', {
      json: {
        userConfig: config,
      },
    })
    .json();

  return true;
};

export const saveConfigAccount = async (config: UserConfigDto): Promise<boolean> => {
  await kyWrapper
    .post('init/saveconfig/account', {
      json: {
        userConfig: config,
      },
    })
    .json();

  return true;
};
