import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import type { ToastMessage } from '@/types';

import { BaseElement } from '@/components/base-element';

import '@/app-router';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

registerIconLibrary('local', {
  resolver: name => `/icons/${name}.svg`,
  mutator: svg => svg.setAttribute('fill', 'currentColor'),
});

registerIconLibrary('hi-outline', {
  resolver: name => `https://cdn.jsdelivr.net/npm/heroicons@2.1.1/24/outline/${name}.svg`,
});

registerIconLibrary('hi-solid', {
  resolver: name => `https://cdn.jsdelivr.net/npm/heroicons@2.1.1/24/solid/${name}.svg`,
});

@customElement('app-root')
export class AppRoot extends BaseElement {
  @state() errorMessage: string | undefined;

  constructor() {
    super();
    this.addEventListener('toast', this.handleToastEvent);
    this.addEventListener('error-message', event => this.handleErrorMessage(event));
    this.addEventListener('app-loading', event => this.handleApiLoading(event));

    // add a window event listener to catch any top-level events
    // https://lit.dev/docs/components/events/#adding-event-listeners-to-other-elements
  }

  render() {
    return html`
      <div id="toast-container"></div>
      <div class="app-root">
        <app-router></app-router>
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
      this.dispatchCustomEvent('update-appstore', {
        ...this.appStore,
        loading,
      });
    }
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
