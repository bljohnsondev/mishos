import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import type { LitElement, ReactiveController } from 'lit';
import { type AnyObject, ValidationError } from 'yup';

import type { ErrorMessage } from '@/types';

type FormElementSelectorNames = 'standard' | 'shoelace';

interface FormElementSelector {
  name: FormElementSelectorNames;
  selector: string;
}

interface FormControllerOptions<T> {
  formSelector?: string;
  onSubmit: (values: T) => void;
  onError?: (errors: ErrorMessage[]) => void;
  schema?: AnyObject;
  errorClass?: string;
  errorSelector?: FormElementSelectorNames;
}

const selectors: FormElementSelector[] = [
  { name: 'standard', selector: 'input,select,textarea,label' },
  { name: 'shoelace', selector: 'sl-input,sl-select,sl-checkbox' },
];

export class FormController<ValuesType> implements ReactiveController {
  host: LitElement;
  form: HTMLFormElement | null;
  formElementsSelector?: FormElementSelector;
  options: FormControllerOptions<ValuesType>;
  errors?: ErrorMessage[];

  constructor(host: LitElement, options: FormControllerOptions<ValuesType>) {
    this.host = host;
    this.host.addController(this);

    this.form = null;

    if (options.errorClass) {
      this.formElementsSelector = selectors.find(sel => sel.name === (options.errorSelector ?? 'shoelace'));
    }

    this.options = {
      formSelector: options.formSelector ?? 'form',
      onSubmit: options.onSubmit,
      onError: options.onError,
      schema: options.schema,
      errorClass: options.errorClass,
    };
  }

  // since the host isn't fully rendered when hostConnected is called set the form here after update
  hostUpdated() {
    if (this.options.formSelector) {
      const form: HTMLFormElement | null = this.host.renderRoot.querySelector(this.options.formSelector);

      // if there is a form and it hasn't already been initialized then add the event handlers
      if (form && !this.isFormInitialized(form)) {
        this.form = form;
        this.form.addEventListener('submit', event => this.handleInternalSubmit(event), false);
        this.form.addEventListener('sl-invalid', this.preventDefault, { capture: true });

        this.setFormInitialized(this.form);
      } else if (!form) {
        this.form = null;
      }
    }
  }

  resetErrors() {
    this.removeErrorClasses();
    this.errors = [];
    this.host.requestUpdate();
  }

  resetForm() {
    this.resetErrors();

    if (this.form) {
      this.form.reset();
    }

    this.host.requestUpdate();
  }

  hasError(name: string) {
    return this.errors && this.errors.length > 0 && this.errors.some(err => err.name === name);
  }

  addError(name: string, message: string): void {
    if (!this.errors) {
      this.errors = [{ name, message }];
      return;
    }

    const existing = this.errors.find(error => error.name === name);

    if (existing) {
      this.errors = [...this.errors.filter(error => error.name !== name), { name, message }];
    } else {
      this.errors = [...this.errors, { name, message }];
    }
  }

  removeError(name: string): void {
    if (this.errors) {
      this.errors = this.errors.filter(error => error.name !== name);
    }
  }

  private handleInternalSubmit(event: Event): void {
    event.preventDefault();

    if (!this.form) return;

    const data = serialize(this.form) as ValuesType;

    if (!this.options?.schema) {
      this.options.onSubmit(data);
      return;
    }

    try {
      this.options.schema.validateSync(data, { abortEarly: false });
      // if no validation error was thrown we're good to call the submit handler
      this.removeErrorClasses();
      this.errors = [];
      this.options.onSubmit(data);
    } catch (err) {
      if (err instanceof ValidationError) {
        this.handleError(err);
      }
    }

    // issue an update on the host to reflect error message changes
    this.host.requestUpdate();
  }

  private handleError(error: ValidationError) {
    this.errors = this.convertValidationError(error);
    this.addErrorClasses();
    if (this.options.onError) this.options.onError(this.errors);
  }

  private addErrorClasses() {
    if (this.form && this.options.errorClass && this.formElementsSelector) {
      const elements = this.form.querySelectorAll(this.formElementsSelector.selector);

      for (const elem of elements) {
        const name = this.getFormElementName(elem);

        if (name) {
          if (this.hasError(name)) {
            elem.classList.add(this.options.errorClass);
          } else {
            elem.classList.remove(this.options.errorClass);
          }
        }
      }
    }
  }

  private removeErrorClasses() {
    if (this.form && this.options.errorClass && this.formElementsSelector) {
      const elements = this.form.querySelectorAll(this.formElementsSelector.selector);

      for (const elem of elements) {
        const name = this.getFormElementName(elem);

        if (name) {
          if (this.hasError(name)) {
            elem.classList.remove(this.options.errorClass);
          }
        }
      }
    }
  }

  private convertValidationError(error: ValidationError): ErrorMessage[] {
    if (!error.inner || error.inner.length === 0) return [];

    // convert the standard yup errors to a simple non-lib specific format
    return error.inner.map(yerr => ({
      name: yerr.path,
      // for now just pull the first first error supplied by yup
      message: yerr.errors && yerr.errors.length > 0 ? yerr.errors[0] : 'Unknown validation error',
    }));
  }

  private getFormElementName(elem: Element) {
    return elem.nodeName.toLowerCase() === 'label' ? elem.getAttribute('for') : elem.getAttribute('name');
  }

  private preventDefault(event: Event): void {
    event.preventDefault();
  }

  private isFormInitialized(form: HTMLFormElement | null): boolean {
    return form !== null && form.hasAttribute('data-is-initialized');
  }

  private setFormInitialized(form: HTMLFormElement): void {
    form.setAttribute('data-is-initialized', 'true');
  }
}
