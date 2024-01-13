import { ZodSchema } from 'zod';

import { ErrorMessage } from '@/types';

export class FormValidator {
  schema: ZodSchema;
  errors: ErrorMessage[];

  constructor(sc: ZodSchema) {
    this.schema = sc;
    this.errors = [];
  }

  public validate(data: object): boolean {
    try {
      const result = this.schema.safeParse(data);
      if (result.success) return true;

      this.errors = result.error?.issues?.map(issue => ({
        name: issue.path.toString(),
        message: issue.message,
      }));

      return false;
    } catch (err) {
      return false;
    }
  }

  public reset(): void {
    this.errors = [];
  }
}
