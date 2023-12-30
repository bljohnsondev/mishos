import { storage } from '@/utils';

export class AuthService {
  public isAuthorized(): Promise<boolean> {
    const token = storage.getToken();
    return new Promise(resolve => {
      resolve(token !== null); // try using resolve(true) for testing
    });
  }
}
