import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { css, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import * as yup from 'yup';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import { initializeFormEvents, FormValidator } from '@/utils';

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

  @state() errorMessage?: string;

  private formValidator: FormValidator<AccountFormValues> = new FormValidator(settingsSchema);

  render() {
    return html`
      <form>
        <div>
          <sl-input type="password" name="passwordCurrent" label="Current Password"></sl-input>
          <form-error-message for="passwordCurrent" .errors=${this.formValidator.errors}></form-error-message>
        </div>
        <div>
          <sl-input type="password" name="passwordNew1" label="New Password"></sl-input>
          <form-error-message for="passwordNew1" .errors=${this.formValidator.errors}></form-error-message>
        </div>
        <div>
          <sl-input type="password" name="passwordNew2" label="Confirm Password"></sl-input>
          <form-error-message for="passwordNew2" .errors=${this.formValidator.errors}></form-error-message>
        </div>
        ${this.errorMessage ? html`<div class="error-message">${this.errorMessage}</div>` : null}
        <div>
          <sl-button variant="primary" type="submit">Save</sl-button>
        </div>
      </form>
    `;
  }

  private async handleSubmit() {
    const data = serialize(this.settingsForm) as AccountFormValues;
    this.errorMessage = undefined;

    if (this.formValidator.validate(data)) {
      this.formValidator.reset();
      this.requestUpdate();
      if (data.passwordNew1 !== data.passwordNew2) {
        this.errorMessage = 'Password do not match';
      } else {
        await saveConfigAccount({
          passwordCurrent: data.passwordCurrent,
          passwordNew1: data.passwordNew1,
          passwordNew2: data.passwordNew2,
        });
        this.toast({ variant: 'success', message: 'Your password has been changed' });
        this.settingsForm.reset();
      }
    } else {
      this.requestUpdate();
    }
  }

  firstUpdated() {
    initializeFormEvents(this.settingsForm, () => this.handleSubmit());
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
