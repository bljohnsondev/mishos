import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert.js';
import { Router } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import { ToastMessage } from '@/types';

import '@shoelace-style/shoelace/dist/components/spinner/spinner';

@customElement('app-root')
export class AppRoot extends LitElement {
  @query('#loading-overlay') loadingOverlay?: HTMLElement;

  constructor() {
    super();
    this.addEventListener('toast', this.handleToastEvent);
    this.addEventListener('side-menu-select', this.handleSideMenuSelect);
  }

  render() {
    return html`
      <div id="toast-container"></div>
      <div class="app-root">
        <div id="loading-overlay" class="loading-hide">
          <div id="loading-spinner"><sl-spinner style="font-size: 1.3rem;"></sl-spinner></div>
        </div>
        <slot></slot>
      </div>
    `;
  }

  private handleSideMenuSelect(event: Event) {
    if (event && event instanceof CustomEvent && event.detail?.item && event.detail.item.route) {
      Router.go(event.detail.item.route);
    }
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
      }) as SlAlert;

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
      if (this.loadingOverlay) {
        if (loading === true) {
          this.loadingOverlay.classList.remove('loading-hide');
          this.loadingOverlay.classList.add('loading-show');
        } else {
          this.loadingOverlay.classList.remove('loading-show');
          this.loadingOverlay.classList.add('loading-hide');
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    // add a window event listener to catch any "error-message" events
    // https://lit.dev/docs/components/events/#adding-event-listeners-to-other-elements
    window.addEventListener('error-message', event => this.handleErrorMessage(event));
    window.addEventListener('api-loading', event => this.handleApiLoading(event));
  }

  static styles = css`
    #loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.2);
    }

    #loading-spinner {
      position: absolute;
      top: 10px;
      right: 1rem;
      @media screen and (min-width: 768px) {
        top: 20px;
        right: 4rem;
      }
    }

    .loading-hide {
      display: none;
    }

    .loading-show {
      display: block;
    }
  `;
}
