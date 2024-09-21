import { kyWrapper } from '@/lib/ky-wrapper';
import type { SettingsAccountDto, SettingsGeneralDto } from '@/types';

export const saveConfigGeneral = async (settings: SettingsGeneralDto): Promise<boolean> => {
  await kyWrapper.post('settings/savegeneral', { json: settings });
  return true;
};

export const saveConfigAccount = async (settings: SettingsAccountDto): Promise<boolean> => {
  await kyWrapper.post('settings/saveaccount', { json: settings });
  return true;
};

export const getExportData = async (): Promise<any> => {
  return await kyWrapper.get('settings/exportdata').blob();
};

export const importData = async (data: FormData): Promise<boolean> => {
  const json: any = await kyWrapper.post('settings/importdata', { body: data }).json();
  return json.imported === true;
};

export const sendTestNotification = async (url: string): Promise<string | null> => {
  try {
    await kyWrapper.post('settings/sendtest', { json: { url } });
  } catch (err) {
    return err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return null;
};
