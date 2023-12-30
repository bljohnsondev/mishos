import ky from 'ky';

import { createEvent, storage } from '@/utils';

const urlPrefix = 'http://localhost:3000/api';

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
        const token = storage.getToken();
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