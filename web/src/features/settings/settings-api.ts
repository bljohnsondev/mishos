import { kyWrapper } from '@/lib/ky-wrapper';
import { UserConfigDto } from '@/types';

export const saveConfigGeneral = async (config: UserConfigDto) => {
  await kyWrapper
    .post('init/saveconfig/general', {
      json: {
        userConfig: config,
      },
    })
    .json();
};

export const saveConfigAccount = async (config: UserConfigDto) => {
  await kyWrapper
    .post('init/saveconfig/account', {
      json: {
        userConfig: config,
      },
    })
    .json();
};
