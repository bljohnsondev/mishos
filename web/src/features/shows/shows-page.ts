import { Router } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { sharedStyles } from '@/styles/shared-styles';
import { ShowDto } from '@/types';

import { getFollowedShows } from './shows-api';

import '@/layout/app-layout';

import './show-card';
import './shows-search-form';

@customElement('shows-page')
export class ShowsPage extends LitElement {
  @state() shows?: ShowDto[];

  render() {
    return html`
      <app-layout icon="tv" headerTitle="Shows" selected="shows">
        <shows-search-form slot="header"></shows-search-form>
        <section class="content">
          ${this.shows && this.shows.length > 0
            ? this.shows.map(
                show => html`
                  <a href="#" class="card-link" @click=${(event: Event) => this.handleSelectShow(event, show)}>
                    <show-card image=${show.imageMedium} name=${show.name} network=${show.network}></show-card>
                  </a>
                `
              )
            : this.renderEmptyShows()}
        </section>
      </app-layout>
    `;
  }

  private renderEmptyShows() {
    return html`<div>You are not following any shows. Use the search to find your favorite shows!</div>`;
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
