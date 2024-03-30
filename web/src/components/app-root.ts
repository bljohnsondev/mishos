import { provide } from '@lit/context';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

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

  async loadInitData() {
    const initData: InitData | undefined = await this.callApi<InitData>(() => kyWrapper.get('auth/init').json(), {
      toastErrors: false,
    });
    this.appStore = {
      ...this.appStore,
      initData,
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    this.loadInitData();
  }
}
