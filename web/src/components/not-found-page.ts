import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { sideMenuItems } from '@/layout/side-menu-items';
import { sharedStyles } from '@/styles/shared-styles';

import '@/layout/app-layout';

@customElement('not-found-page')
export class NotFoundPage extends LitElement {
  render() {
    return html`
      <app-layout .sideitems=${sideMenuItems}>
        <section class="content">The page you requested could not be found.</section>
      </app-layout>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .content {
        margin: var(--sl-spacing-large);
      }
    `,
  ];
}
