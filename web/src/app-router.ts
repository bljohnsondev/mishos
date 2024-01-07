import '@fontsource/inter';
import '@fontsource/inter/500.css';
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';
import { Router } from '@vaadin/router';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import { routes } from './routes';

import '@/components/app-root';

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

@customElement('app-router')
export class AppRouter extends LitElement {
  @query('#router')
  router?: HTMLElement;

  render() {
    return html`
      <app-root>
        <div id="router"></div>
      </app-root>
    `;
  }

  firstUpdated() {
    if (this.router) {
      const router = new Router(this.router);
      router.setRoutes(routes);
    }
  }
}
