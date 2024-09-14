import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import * as yup from 'yup';

import { FormController } from '@/components/form-controller';
import { sharedStyles } from '@/styles/shared-styles';
import type { ToastMessage } from '@/types';
import { createEvent, setToken } from '@/utils';

import { login } from './auth-api';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import '@/components/form-error-message';

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

@customElement('login-page')
export class LoginPage extends LitElement {
  private formController: FormController<LoginFormValues> = new FormController<LoginFormValues>(this, {
    onSubmit: values => this.handleSubmit(values),
    schema: loginSchema,
  });

  @state() toast?: ToastMessage;

  render() {
    return html`
      <div class="login-container">
        <div>
          <h1>MISHOS</h1>
          <div class="login-window">
            <form>
              <div>
                <sl-input name="username" label="Username" placeholder="Username"></sl-input>
                <form-error-message for="username" .errors=${this.formController.errors}></form-error-message>
              </div>
              <div>
                <sl-input name="password" label="Password" placeholder="Password" type="password"></sl-input>
                <form-error-message for="password" .errors=${this.formController.errors}></form-error-message>
              </div>
              <sl-button type="submit" variant="primary">Login</sl-button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  private handleSubmit(values: LoginFormValues) {
    this.requestUpdate();

    login(values.username, values.password)
      .then(response => {
        if (response.user && response.token) {
          setToken(response.token);
          this.dispatchEvent(createEvent('load-initdata'));
          Router.go('/');
        }
      })
      .catch(() => {
        const toast = { variant: 'danger', message: 'Login failed' };
        this.dispatchEvent(createEvent('toast', toast));
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
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .login-window {
        background-color: var(--sl-color-neutral-50);
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-large);
        padding: var(--sl-spacing-medium);
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

      @media screen and (min-width: 1024px) {
        .login-window {
          width: 380px;
        }
      }
    `,
  ];
}
