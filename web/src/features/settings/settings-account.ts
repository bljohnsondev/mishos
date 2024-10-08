import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as yup from 'yup';

import { BaseElement } from '@/components/base-element';
import { FormController } from '@/components/form-controller';
import { sharedStyles } from '@/styles/shared-styles';

import { saveConfigAccount } from './settings-api';

import '@/components/form-error-message';

const settingsSchema = yup.object({
  passwordCurrent: yup.string().required('Current password is required'),
  passwordNew1: yup.string().required('New password is required'),
  passwordNew2: yup.string().required('Confirm password is required'),
});

type AccountFormValues = yup.InferType<typeof settingsSchema>;

@customElement('settings-account')
export class SettingsAccount extends BaseElement {
  private formController: FormController<AccountFormValues> = new FormController<AccountFormValues>(this, {
    onSubmit: values => this.handleSubmit(values),
    schema: settingsSchema,
  });

  render() {
    return html`
      <form>
        <div>
          <sl-input type="password" name="passwordCurrent" label="Current Password"></sl-input>
          <form-error-message for="passwordCurrent" .errors=${this.formController.errors}></form-error-message>
        </div>
        <div>
          <sl-input type="password" name="passwordNew1" label="New Password"></sl-input>
          <form-error-message for="passwordNew1" .errors=${this.formController.errors}></form-error-message>
        </div>
        <div>
          <sl-input type="password" name="passwordNew2" label="Confirm Password"></sl-input>
          <form-error-message for="passwordNew2" .errors=${this.formController.errors}></form-error-message>
          <form-error-message for="matching" .errors=${this.formController.errors}></form-error-message>
        </div>
        <div>
          <sl-button variant="primary" type="submit">Save</sl-button>
        </div>
      </form>
    `;
  }

  private async handleSubmit(values: AccountFormValues) {
    this.requestUpdate();
    this.formController.resetErrors();

    if (values.passwordNew1 !== values.passwordNew2) {
      this.formController.addError('passwordNew2', 'Passwords do not match');
    } else {
      const result = await this.callApi<boolean>(() =>
        saveConfigAccount({
          passwordCurrent: values.passwordCurrent,
          passwordNew1: values.passwordNew1,
          passwordNew2: values.passwordNew2,
        })
      );

      if (result) {
        this.toast({ variant: 'success', message: 'Your password has been changed' });
        this.formController.resetForm();
      }
    }
  }

  static styles = [
    sharedStyles,
    css`
      form {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
      }

      sl-input::part(form-control-label),
      sl-select::part(form-control-label) {
        padding-bottom: var(--sl-spacing-2x-small);
      }

      @media screen and (min-width: 640px) {
        form {
          width: 400px;
        }
      }
    `,
  ];
}
