import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { addWatch } from '@/features/shows/shows-api';
import { sideMenuItems } from '@/layout/side-menu-items';
import { sharedStyles } from '@/styles/shared-styles';
import { EpisodeDto } from '@/types';
import { createToastEvent, formatDate } from '@/utils';

import { getWatchList } from './wachlist-api';

import '@/layout/app-layout';

import '@/features/shows/shows-header';

import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/icon/icon';

@customElement('watchlist-page')
export class WatchListPage extends LitElement {
  @state() episodes?: EpisodeDto[];

  render() {
    return html`
      <app-layout .sideitems=${sideMenuItems} selected="watchlist">
        <shows-header headerTitle="Watch List"></shows-header>
        <section class="content">
          ${this.episodes
            ? this.episodes.length > 0
              ? html`
                  <ul class="episode-list">
                    ${this.episodes.map(episode => {
                      return html`<li>${this.renderEpisode(episode)}</li>`;
                    })}
                  </ul>
                `
              : html`<div class="caughtup">You are all caught up!</div>`
            : null}
        </section>
      </app-layout>
    `;
  }

  private renderEpisode(episode: EpisodeDto): TemplateResult | null {
    return episode.show
      ? html`
          <div class="episode">
            <div class="show-image-container">
              <img class="show-image" src=${episode.show.imageMedium} alt=${episode.show.name} />
            </div>
            <div>
              <h1>${episode.show.name}</h1>
              <div class="episode-details">
                S${episode.seasonNumber} E${episode.number} &middot; ${formatDate(episode.aired)}
              </div>
              <div class="episode-title">${episode.name}</div>
              <sl-button variant="default" size="small" @click=${() => this.handleWatch(episode)}>
                <sl-icon slot="prefix" library="hi-outline" name="eye"></sl-icon>
                Mark Watched
              </sl-button>
            </div>
          </div>
        `
      : null;
  }

  async handleWatch(episode: EpisodeDto) {
    if (episode && episode.id) {
      await addWatch(episode.id, true, 'single');
      this.episodes = await getWatchList();
      this.dispatchEvent(
        createToastEvent({
          variant: 'success',
          message: `"${episode.name}" marked as watched`,
        })
      );
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    this.episodes = await getWatchList();
  }

  static styles = [
    sharedStyles,
    css`
      .content {
        margin: var(--sl-spacing-large);
      }

      .episode-list {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .episode {
        display: flex;
        align-items: start;
        gap: var(--sl-spacing-small);
        border-bottom: 1px solid var(--sl-color-neutral-100);
        padding-bottom: var(--sl-spacing-medium);
        :is(h1) {
          margin: 0;
          padding: 0;
          font-weight: var(--sl-font-weight-semibold);
          font-size: var(--sl-font-size-small);
        }
      }

      .show-image-container {
        width: 80px;
      }

      .show-image {
        display: block;
        width: 100%;
        height: auto;
        border-radius: var(--sl-border-radius-medium);
      }

      .episode-details {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-500);
        margin: var(--sl-spacing-x-small) 0;
      }

      .episode-title {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-700);
      }

      sl-button {
        margin-top: var(--sl-spacing-x-small);
      }
    `,
  ];
}
