import { css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import * as yup from 'yup';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import type { ErrorMessage, UserDto } from '@/types';
import { initializeForm } from '@/utils';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

import '@/components/confirm-dialog';

const userSchema = yup.object({
  username: yup.string().trim().required('Username is required'),
  role: yup.string().required('Role is required'),
});

type UserFormValues = yup.InferType<typeof userSchema>;

@customElement('user-edit')
export class UserEdit extends BaseElement {
  @query('#user-form') userForm!: HTMLFormElement;

  @property({ attribute: false }) user?: UserDto;

  @state() errorMessages?: ErrorMessage[];
  @state() showConfirm = false;

  render() {
    if (!this.user || !this.isAdmin()) return null;

    return html`
      <form id="user-form">
        <div class="top-container">
          <sl-icon-button
            class="back-button"
            library="hi-solid"
            name="chevron-left"
            @click=${() => this.dispatchCustomEvent('close')}
          ></sl-icon-button>
          <div>
            <sl-input name="username" value=${ifDefined(this.user.username)}></sl-input>
            <form-error-message for="username" .errors=${this.errorMessages}></form-error-message>
          </div>
          <div>
            <sl-select name="role" placeholder="Select role" value=${ifDefined(this.user.role)} class="role-select">
              <sl-option value="admin">Admin</sl-option>
              <sl-option value="user">User</sl-option>
            </sl-select>
            <form-error-message for="role" .errors=${this.errorMessages}></form-error-message>
          </div>
        </div>
        <div class="actions">
          <sl-button type="submit" variant="primary">Save</sl-button>
          ${
            this.user?.id
              ? html`<sl-button class="delete-button" variant="danger" @click=${this.handleShowConfirm}>Delete</sl-button>`
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
    this.errorMessages = [];

    if (this.user) {
      const editedUser: UserDto = {
        ...this.user,
        username: values.username,
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

  firstUpdated() {
    initializeForm<UserFormValues>(this.userForm, {
      schema: userSchema,
      onSubmit: values => this.handleSubmit(values),
      onError: errors => {
        this.errorMessages = errors;
      },
    });
  }

  static styles = [
    sharedStyles,
    css`
      .top-container {
        font-size: var(--sl-font-size-large);
        color: var(--sl-color-neutral-800);
        margin-bottom: var(--sl-spacing-medium);
        display: flex;
        align-items: flex-start;
        gap: var(--sl-spacing-small);
      }

      .username {
        font-weight: bold;
      }

      sl-icon-button.back-button {
        border: 1px solid var(--sl-color-neutral-500);
        border-radius: var(--sl-border-radius-medium);
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
