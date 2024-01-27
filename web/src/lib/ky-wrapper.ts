import ky from 'ky';

import { getToken } from '@/utils';

const urlPrefix = import.meta.env.VITE_API_URL;

export const kyWrapper = ky.extend({
  prefixUrl: urlPrefix,
  //throwHttpErrors: false,
  retry: 0,
  timeout: false,
  hooks: {
    beforeRequest: [
      request => {
        const token = getToken();
        request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});
