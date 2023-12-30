import { Router } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { sideMenuItems } from '@/layout/side-menu-items';
import { sharedStyles } from '@/styles/shared-styles';
import { ShowDto } from '@/types';

import { getFollowedShows } from './shows-api';

import '@/layout/app-layout';

import './show-card';
import './shows-header';

@customElement('shows-page')
export class ShowsPage extends LitElement {
  @state() shows?: ShowDto[];

  render() {
    return html`
      <app-layout .sideitems=${sideMenuItems} selected="shows">
        <shows-header></shows-header>
        <section class="content">
          ${this.shows && this.shows.length > 0
            ? this.shows.map(
                show => html`
                  <a href="#" class="card-link" @click=${(event: Event) => this.handleSelectShow(event, show)}>
                    <show-card image=${show.imageMedium} name=${show.name} network=${show.network}></show-card>
                  </a>
                `
              )
            : null}
        </section>
      </app-layout>
    `;
  }

  private handleSelectShow(event: Event, show: ShowDto) {
    event.preventDefault();
    if (show && this.shows) {
      Router.go(`/show/view/${show.id}`);
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    this.shows = await getFollowedShows();
  }

  static styles = [
    sharedStyles,
    css`
      .content {
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
        gap: var(--sl-spacing-medium);
        margin: var(--sl-spacing-large);
      }
    `,
  ];
}
