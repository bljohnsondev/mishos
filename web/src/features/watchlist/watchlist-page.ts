import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';

import { sharedStyles } from '@/styles/shared-styles';
import type { EpisodeDto } from '@/types';

import '@/components/episode-name-tooltip';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import './watchlist-unwatched';
import './watchlist-recent';

@customElement('watchlist-page')
export class WatchListPage extends LitElement {
  @state() episodes?: EpisodeDto[];
  @state() section = 'unwatched';

  render() {
    return html`
      <app-layout icon="check-badge" headerTitle="Watch List" selected="watchlist">
        <shows-search-form slot="header"></shows-search-form>
        <ul class="header-tabs" slot="header">
          <li>
            <sl-button
              variant="text"
              size="medium"
              class=${classMap({ 'header-selected': this.section === 'unwatched' })}
              @click=${() => {
                this.section = 'unwatched';
              }}
            >
              Unwatched
            </sl-button>
          </li>
          <li>
            <sl-button
              variant="text"
              size="medium"
              class=${classMap({ 'header-selected': this.section === 'recent' })}
              @click=${() => {
                this.section = 'recent';
              }}
            >
              Recently Watched
            </sl-button>
          </li>
        </ul>
        <section class="content">
          ${choose(this.section, [
            ['unwatched', () => html`<watchlist-unwatched></watchlist-unwatched>`],
            ['recent', () => html`<watchlist-recent></watchlist-recent>`],
          ])}
        </section>
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
