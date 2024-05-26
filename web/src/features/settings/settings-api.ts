import { kyWrapper } from '@/lib/ky-wrapper';
import { SettingsAccountDto, SettingsGeneralDto } from '@/types';

export const saveConfigGeneral = async (settings: SettingsGeneralDto): Promise<boolean> => {
  await kyWrapper.post('settings/savegeneral', { json: settings });
  return true;
};

export const saveConfigAccount = async (settings: SettingsAccountDto): Promise<boolean> => {
  await kyWrapper.post('settings/saveaccount', { json: settings });
  return true;
};

export const getExportData = async (): Promise<any> => {
  return await kyWrapper.get('init/exportdata').blob();
};

export const importData = async (data: FormData): Promise<boolean> => {
  const json: any = await kyWrapper.post('settings/importdata', { body: data }).json();
  return json.imported === true;
};
