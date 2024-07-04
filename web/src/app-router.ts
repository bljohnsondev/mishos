import { Router } from '@vaadin/router';
import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import { routes } from './routes';

@customElement('app-router')
export class AppRouter extends LitElement {
  @query('#router')
  router?: HTMLElement;

  render() {
    return html`<div id="router"></div>`;
  }

  firstUpdated() {
    if (this.router) {
      const router = new Router(this.router);
      router.setRoutes(routes);
    }
  }
}
