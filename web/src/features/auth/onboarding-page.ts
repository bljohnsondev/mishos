import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import * as yup from 'yup';

import { sharedStyles } from '@/styles/shared-styles';
import type { ErrorMessage, ToastMessage } from '@/types';
import { createEvent, initializeForm } from '@/utils';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import '@/components/form-error-message';

import { createInitialUser } from './auth-api';

const createSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

type CreateFormValues = yup.InferType<typeof createSchema>;

@customElement('onboarding-page')
export class OnboardingPage extends LitElement {
  @query('form') createForm!: HTMLFormElement;

  @state() toast?: ToastMessage;
  @state() errorMessages: ErrorMessage[] = [];

  render() {
    return html`
      <div class="login-container">
        <div>
          <h1>Welcome to MISHOS</h1>
          <div class="login-window">
            <p>
              It looks like this is the first time you are running Mishos! Please create your account to get started.
            </p>
            <form>
              <div>
                <sl-input name="username" label="Username" placeholder="Username"></sl-input>
                <form-error-message for="username" .errors=${this.errorMessages}></form-error-message>
              </div>
              <div>
                <sl-input
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  password-toggle
                ></sl-input>
                <form-error-message for="password" .errors=${this.errorMessages}></form-error-message>
              </div>
              <sl-button type="submit" variant="primary">Create</sl-button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  private handleSubmit(values: CreateFormValues) {
    this.requestUpdate();
    this.errorMessages = [];

    createInitialUser(values.username, values.password)
      .then(() => {
        const toast = { variant: 'success', message: 'User created' };
        this.dispatchEvent(createEvent('toast', toast));
        Router.go('/login');
      })
      .catch(() => {
        const toast = { variant: 'danger', message: 'Create user failed' };
        this.dispatchEvent(createEvent('toast', toast));
      });
  }

  firstUpdated() {
    initializeForm<CreateFormValues>(this.createForm, {
      schema: createSchema,
      onSubmit: values => this.handleSubmit(values),
      onError: errors => {
        this.errorMessages = errors;
      },
    });
  }

  static styles = [
    sharedStyles,
    css`
      h1 {
        text-align: center;
      }

      .login-container {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        height: 100vh;
        margin-top: var(--sl-spacing-medium);
        @media screen and (min-width: 768px) {
          align-items: center;
          margin-top: 0;
        }
      }

      .login-window {
        background-color: var(--sl-color-neutral-50);
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-large);
        padding: var(--sl-spacing-medium);
        margin-inline: var(--sl-spacing-small);
        @media screen and (min-width: 768px) {
          width: 380px;
        }
      }

      .login-window p {
        margin-top: 0;
        color: var(--sl-color-neutral-900);
      }

      h1 {
        font-size: var(--sl-font-size-large);
        margin: 0 0 var(--sl-spacing-large) 0;
        font-size: var(--sl-font-size-large);
        font-weight: var(--sl-font-weight-semibold);
      }

      form {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
      }
    `,
  ];
}
