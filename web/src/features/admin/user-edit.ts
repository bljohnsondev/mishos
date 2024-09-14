import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import * as yup from 'yup';

import { BaseElement } from '@/components/base-element';
import { FormController } from '@/components/form-controller';
import { sharedStyles } from '@/styles/shared-styles';
import type { UserDto } from '@/types';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

import '@/components/confirm-dialog';

const userSchema = yup.object({
  username: yup.string().trim().required('Username is required'),
  password: yup.string().trim(),
  role: yup.string().required('Role is required'),
});

type UserFormValues = yup.InferType<typeof userSchema>;

@customElement('user-edit')
export class UserEdit extends BaseElement {
  private formController: FormController<UserFormValues> = new FormController<UserFormValues>(this, {
    onSubmit: values => this.handleSubmit(values),
    schema: userSchema,
  });

  @property({ attribute: false }) user?: UserDto;

  @state() showConfirm = false;

  render() {
    if (!this.user || !this.isAdmin()) return null;

    return html`
      <form id="user-form">
        <div>
          <sl-icon-button
            class="back-button"
            library="hi-solid"
            name="chevron-left"
            @click=${() => this.dispatchCustomEvent('close')}
          ></sl-icon-button>
        </div>
        <div class="top-container">
          <div>
            <sl-input label="Username" name="username" value=${ifDefined(this.user.username)}></sl-input>
            <form-error-message for="username" .errors=${this.formController.errors}></form-error-message>
            <div class="password">
              <sl-input label="Password" name="password" type="password"></sl-input>
              <form-error-message for="password" .errors=${this.formController.errors}></form-error-message>
            </div>
          </div>
          <div>
            <sl-select label="Role" name="role" placeholder="Select role" value=${ifDefined(this.user.role)} class="role-select">
              <sl-option value="admin">Admin</sl-option>
              <sl-option value="user">User</sl-option>
            </sl-select>
            <form-error-message for="role" .errors=${this.formController.errors}></form-error-message>
          </div>
        </div>
        <div class="actions">
          <sl-button type="submit" variant="primary">Save</sl-button>
          ${
            this.user?.id
              ? html`
                <sl-button
                  class="delete-button"
                  variant="danger"
                  ?disabled=${this.user?.id === 1}
                  @click=${this.handleShowConfirm}
                >
                  Delete
                </sl-button>
              `
              : null
          }
        </div>
      </form>
      <confirm-dialog
        label="Delete User?"
        ?open=${this.showConfirm}
        @sl-hide=${this.handleCloseConfirm}
        @confirm-ok=${this.handleDeleteUser}
        @confirm-cancel=${this.handleCloseConfirm}
      >
        <div>
          Are you sure you want to delete brent?
        </div>
        <div class="delete-warning">
          This will PERMANENTLY delete the user account, show follows and watch history!
        </div>
      </confirm-dialog>
    `;
  }

  private async handleSubmit(values: UserFormValues) {
    this.formController.resetErrors();

    if (this.user) {
      if (!this.user.id && !values.password) {
        // for new users password is required
        this.formController.addError('password', 'Password is required for new users');
        return;
      }

      const editedUser: UserDto = {
        ...this.user,
        username: values.username,
        password: values.password,
        role: values.role,
      };

      this.dispatchCustomEvent('save-user', editedUser);
    }
  }

  private handleShowConfirm() {
    this.showConfirm = true;
  }

  private handleCloseConfirm() {
    this.showConfirm = false;
  }

  private handleDeleteUser() {
    this.showConfirm = false;
    this.dispatchCustomEvent('delete-user', this.user);
  }

  static styles = [
    sharedStyles,
    css`
      .top-container {
        font-size: var(--sl-font-size-large);
        color: var(--sl-color-neutral-800);
        margin-top: var(--sl-spacing-medium);
        margin-bottom: var(--sl-spacing-medium);
        display: flex;
        align-items: flex-start;
        gap: var(--sl-spacing-small);
      }

      sl-icon-button.back-button {
        border: 1px solid var(--sl-color-neutral-500);
        border-radius: var(--sl-border-radius-medium);
      }

      .username {
        font-weight: bold;
      }

      .password {
        margin-top: var(--sl-spacing-x-small);
      }

      .role-select {
        width: 10rem;
      }

      .actions {
        display: flex;
        gap: var(--sl-spacing-small);
        margin-top: var(--sl-spacing-medium);
      }

      .delete-warning {
        margin-top: var(--sl-spacing-medium);
        font-style: italic;
      }
    `,
  ];
}
