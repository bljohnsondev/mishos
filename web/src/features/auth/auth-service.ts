import { getToken } from '@/utils';

export class AuthService {
  public isAuthorized(): Promise<boolean> {
    const token = getToken();
    return new Promise(resolve => {
      resolve(token !== null); // try using resolve(true) for testing
    });
  }
}
