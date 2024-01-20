import { css, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import * as yup from 'yup';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import { ErrorMessage } from '@/types';
import { initializeForm } from '@/utils';

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
  @query('form') settingsForm!: HTMLFormElement;

  @state() errorMessages?: ErrorMessage[];

  render() {
    return html`
      <form>
        <div>
          <sl-input type="password" name="passwordCurrent" label="Current Password"></sl-input>
          <form-error-message for="passwordCurrent" .errors=${this.errorMessages}></form-error-message>
        </div>
        <div>
          <sl-input type="password" name="passwordNew1" label="New Password"></sl-input>
          <form-error-message for="passwordNew1" .errors=${this.errorMessages}></form-error-message>
        </div>
        <div>
          <sl-input type="password" name="passwordNew2" label="Confirm Password"></sl-input>
          <form-error-message for="passwordNew2" .errors=${this.errorMessages}></form-error-message>
          <form-error-message for="matching" .errors=${this.errorMessages}></form-error-message>
        </div>
        <div>
          <sl-button variant="primary" type="submit">Save</sl-button>
        </div>
      </form>
    `;
  }

  private async handleSubmit(values: AccountFormValues) {
    this.requestUpdate();
    this.errorMessages = [];

    if (values.passwordNew1 !== values.passwordNew2) {
      this.errorMessages = [{ name: 'matching', message: 'Passwords do not match' }];
    } else {
      await saveConfigAccount({
        passwordCurrent: values.passwordCurrent,
        passwordNew1: values.passwordNew1,
        passwordNew2: values.passwordNew2,
      });
      this.toast({ variant: 'success', message: 'Your password has been changed' });
      this.settingsForm.reset();
    }
  }

  firstUpdated() {
    initializeForm<AccountFormValues>(this.settingsForm, {
      schema: settingsSchema,
      onSubmit: values => this.handleSubmit(values),
      onError: errors => (this.errorMessages = errors),
    });
  }

  static styles = [
    sharedStyles,
    css`
      form {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        @media screen and (min-width: 640px) {
          width: 400px;
        }
      }

      sl-input::part(form-control-label),
      sl-select::part(form-control-label) {
        padding-bottom: var(--sl-spacing-2x-small);
      }
    `,
  ];
}
