import ky from 'ky';

import { createEvent, getToken } from '@/utils';

const urlPrefix = import.meta.env.VITE_API_URL;

export const kyWrapper = ky.extend({
  prefixUrl: urlPrefix,
  //throwHttpErrors: false,
  retry: 0,
  timeout: false,
  hooks: {
    beforeError: [
      async error => {
        const json = await error.response.json();
        if (json) {
          dispatchEvent(createEvent('error-message', json));
        }
        return error;
      },
    ],
    beforeRequest: [
      request => {
        const token = getToken();
        request.headers.set('Authorization', `Bearer ${token}`);
        dispatchEvent(createEvent('api-loading', true));
      },
    ],
    afterResponse: [
      () => {
        dispatchEvent(createEvent('api-loading', false));
      },
    ],
  },
});
