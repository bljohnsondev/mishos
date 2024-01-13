import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { Router } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { z, ZodSchema } from 'zod';

import { sharedStyles } from '@/styles/shared-styles';
import { ToastMessage } from '@/types';
import { initializeFormEvents, setToken, FormValidator, createEvent } from '@/utils';

import { login } from './auth-api';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import '@/components/form-error-message';

interface LoginFormValues {
  username?: string;
  password?: string;
}

const loginSchema: ZodSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

@customElement('login-page')
export class LoginPage extends LitElement {
  @query('form') loginForm!: HTMLFormElement;

  @state() toast?: ToastMessage;

  private formValidator: FormValidator = new FormValidator(loginSchema);

  render() {
    return html`
      <div class="login-container">
        <div>
          <h1>MISHOS</h1>
          <div class="login-window">
            <form>
              <div>
                <sl-input name="username" label="Username" placeholder="Username"></sl-input>
                <form-error-message for="username" .errors=${this.formValidator.errors}></form-error-message>
              </div>
              <div>
                <sl-input name="password" label="Password" placeholder="Password" type="password"></sl-input>
                <form-error-message for="password" .errors=${this.formValidator.errors}></form-error-message>
              </div>
              <sl-button type="submit" variant="primary">Login</sl-button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  private handleSubmit() {
    const data = serialize(this.loginForm) as LoginFormValues;
    if (this.formValidator.validate(data) && data.username && data.password) {
      this.formValidator.reset();
      this.requestUpdate();
      login(data.username, data.password)
        .then(response => {
          if (response.user && response.token) {
            setToken(response.token);
            Router.go('/');
          }
        })
        .catch(() => {
          const toast = { variant: 'danger', message: 'Login failed' };
          this.dispatchEvent(createEvent('toast', toast));
        });
    } else {
      this.requestUpdate();
    }
  }

  firstUpdated() {
    initializeFormEvents(this.loginForm, () => this.handleSubmit());
  }

  static styles = [
    sharedStyles,
    css`
      h1 {
        text-align: center;
      }

      .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .login-window {
        background-color: var(--sl-color-neutral-50);
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-large);
        padding: var(--sl-spacing-medium);
        @media screen and (min-width: 1024px) {
          width: 380px;
        }
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
