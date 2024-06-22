import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { ValidationError } from 'yup';
import type { AnyObject } from 'yup';

import type { ErrorMessage } from '@/types';

export interface InitFormOptions<T> {
  onSubmit: (values: T) => void;
  schema?: AnyObject;
  onError?: (errors: ErrorMessage[]) => void;
}

export const initializeForm = <T>(form: HTMLFormElement, options: InitFormOptions<T>): void => {
  form.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    form.addEventListener('sl-invalid', cancelEventDefault, { capture: true });

    const data = serialize(form) as T;

    if (!options.schema) {
      options.onSubmit(data);
      return;
    }

    try {
      options.schema.validateSync(data, { abortEarly: false });
      // if no validation error was thrown we're good to call the submit handler
      options.onSubmit(data);
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors = convertValidationError(err);
        if (options.onError) options.onError(errors);
      }
    }
  });
};

export const convertValidationError = (error: ValidationError): ErrorMessage[] => {
  if (!error.inner || error.inner.length === 0) return [];

  // convert the standard yup errors to a simple non-lib specific format
  return error.inner.map(yerr => ({
    name: yerr.path,
    // for now just pull the first first error supplied by yup
    message: yerr.errors && yerr.errors.length > 0 ? yerr.errors[0] : 'Unknown validation error',
  }));
};

export const cancelEventDefault = (event: Event) => {
  event.preventDefault();
};
