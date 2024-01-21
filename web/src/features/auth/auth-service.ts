import { getToken } from '@/utils';

import { getOnboardReady } from './auth-api';

export class AuthService {
  public isAuthorized(): Promise<boolean> {
    const token = getToken();
    return new Promise(resolve => {
      resolve(token !== null); // try using resolve(true) for testing
    });
  }

  public async isOnboardReady(): Promise<boolean> {
    const result = await getOnboardReady();
    return result?.ready ?? false;
  }
}
