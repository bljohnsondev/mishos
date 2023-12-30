import { AnyObject, ObjectSchema, ValidationError } from 'yup';

import { ErrorMessage } from '@/types';

export class FormValidator<FormValues extends AnyObject> {
  schema: ObjectSchema<FormValues>;
  errors: ErrorMessage[];

  constructor(sc: ObjectSchema<FormValues>) {
    this.schema = sc;
    this.errors = [];
  }

  public validate(data: object): boolean {
    try {
      this.schema.validateSync(data, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof ValidationError) this.setValidationErrors(err);
      return false;
    }
  }

  public reset(): void {
    this.errors = [];
  }

  private setValidationErrors(error: ValidationError): void {
    if (!error.inner || error.inner.length === 0) return;

    // convert the standard yup errors to a simple non-lib specific format
    this.errors = error.inner.map(yerr => ({
      name: yerr.path,
      // for now just pull the first first error supplied by yup
      message: yerr.errors && yerr.errors.length > 0 ? yerr.errors[0] : 'Unknown validation error',
    }));
  }
}
