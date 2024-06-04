import { provide } from '@lit/context';
import { HTTPError } from 'ky';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { kyWrapper } from '@/lib/ky-wrapper';
import { appContext } from '@/store/app-context';
import { AppStore, InitData, ToastMessage } from '@/types';

import { BaseElement } from './base-element';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

@customElement('app-root')
export class AppRoot extends BaseElement {
  @provide({ context: appContext })
  appStore: AppStore = {
    loading: false,
  };

  @state() errorMessage: string | undefined;

  constructor() {
    super();
    this.addEventListener('toast', this.handleToastEvent);
    this.addEventListener('error-message', event => this.handleErrorMessage(event));
    this.addEventListener('app-loading', event => this.handleApiLoading(event));
    this.addEventListener('load-initdata', () => this.loadInitData());

    // add a window event listener to catch any top-level events
    // https://lit.dev/docs/components/events/#adding-event-listeners-to-other-elements
  }

  render() {
    return html`
      <div id="toast-container"></div>
      <div class="app-root">
        ${when(
          this.errorMessage === undefined,
          () => html`<slot></slot>`,
          () => html`
            <div class="init-error">
              An error has occurred. Please check the server logs for more information.
              <div class="error-message">${this.errorMessage}</div>
            </div>
          `
        )}
        <slot></slot>
      </div>
    `;
  }

  private handleToastEvent(event: Event) {
    if (event && event instanceof CustomEvent && event.detail) {
      this.toastMessage(event.detail as ToastMessage);
    }
  }

  private toastMessage(toast: ToastMessage) {
    if (toast) {
      const variant = toast.variant ?? 'primary';

      const alert = Object.assign(document.createElement('sl-alert'), {
        variant,
        closable: true,
        duration: 3000,
        innerHTML: `
          ${toast.title ? `<strong>${toast.title}</strong>` : ''}
          ${this.escapeHtml(toast.message)}
        `,
      });

      const container = this.renderRoot.querySelector('#toast-container');

      if (container) {
        container.append(alert);
        customElements.whenDefined('sl-alert').then(() => alert.toast());
      }
    }
  }

  private escapeHtml(html: string) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  private handleErrorMessage(event: Event) {
    if (event && event instanceof CustomEvent && event.detail) {
      if (event.detail.statusCode === 400 && event.detail.message) {
        // gracefully handle an error 400
        this.toastMessage({
          variant: 'danger',
          message: event.detail.message,
        });
      }
    }
  }

  private handleApiLoading(event: Event) {
    if (event && event instanceof CustomEvent) {
      const loading = event.detail;
      this.appStore = {
        ...this.appStore,
        loading,
      };
    }
  }

  loadInitData() {
    this.callApi<InitData>(() => kyWrapper.get('auth/init').json(), {
      toastErrors: false,
    })
      .then((initData: InitData | undefined) => {
        this.appStore = {
          ...this.appStore,
          initData,
        };
      })
      .catch(ex => {
        if (ex instanceof HTTPError && ex.response.status === 401) {
          // an error code 401 is a good thing
          this.errorMessage = undefined;
        } else {
          this.errorMessage = ex.message ?? 'Unknown error';
        }
      });
  }

  async connectedCallback() {
    super.connectedCallback();
    this.loadInitData();
  }

  static styles = css`
    .init-error {
      width: 65%;
      margin: 2rem auto;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-800);
      padding: var(--sl-spacing-large);
      border: 1px solid var(--sl-color-neutral-300);
      border-radius: var(--sl-border-radius-medium);
      text-align: center;
    }

    .error-message {
      margin-top: 0.875rem;
      color: var(--sl-color-neutral-600);
      font-style: italic;
    }
  `;
}
