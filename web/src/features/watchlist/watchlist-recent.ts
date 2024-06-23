import { Router } from '@vaadin/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { css, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { BaseElement } from '@/components/base-element';
import { watchEpisode } from '@/features/shows/shows-api';
import { sharedStyles } from '@/styles/shared-styles';
import type { WatchlistEpisodeDto } from '@/types';
import { createToastEvent, formatAirTime } from '@/utils';

import { getWatchListRecent } from './wachlist-api';

import '@/components/episode-name-tooltip';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

dayjs.extend(relativeTime);

@customElement('watchlist-recent')
export class WatchListRecent extends BaseElement {
  @state() episodes?: WatchlistEpisodeDto[];

  render() {
    return html`
      ${
        this.episodes
          ? this.episodes.length > 0
            ? html`
              <ul class="episode-list">
                ${this.episodes.map(episode => {
                  return html`<li>${this.renderEpisode(episode)}</li>`;
                })}
              </ul>
            `
            : html`<div>No recently watched episodes</div>`
          : null
      }
    `;
  }

  private renderEpisode(episode: WatchlistEpisodeDto): TemplateResult | null {
    return episode.id
      ? html`
          <div class="episode">
            <a href="#" class="show-image-container" @click=${(event: Event) => this.handleClickShow(event, episode)}>
              <img
                class="show-image"
                src=${episode.imageMedium ?? '/images/empty-image.svg'}
                alt=${episode.showName ?? 'Unknown show'}
              />
            </a>
            <div class="episode-info">
              <h1>${episode.showName}</h1>
              <div class="episode-name">${episode.name}</div>
              <div class="episode-summary">${episode.summary}</div>
              <ul class="detail-list">
                <li>S${episode.seasonNumber} E${episode.number}</li>
                ${episode.network ? html`<li>${episode.network}</li>` : null}
                ${episode.aired ? html`<li>${formatAirTime(episode.aired)}</li>` : null}
                ${episode.runtime ? html`<li>${episode.runtime}m</li>` : null}
              </ul>
              <div class="watched-date">Watched ${dayjs(episode.watchedAt).fromNow()}</div>
            </div>
          </div>
        `
      : null;
  }

  private handleClickShow(event: Event, episode: WatchlistEpisodeDto) {
    event.preventDefault();
    Router.go(`/show/view/${episode.showId}?season=${episode.seasonNumber}`);
  }

  async handleWatch(episode: WatchlistEpisodeDto) {
    if (episode && episode.id) {
      await watchEpisode(episode.id, true);
      this.episodes = await this.callApi(() => getWatchListRecent());
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
    this.episodes = await this.callApi(() => getWatchListRecent());
  }

  static styles = [
    sharedStyles,
    css`
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
      }

      .episode h1 {
        margin: 0;
        padding: 0;
        font-weight: var(--sl-font-weight-semibold);
        font-size: var(--sl-font-size-small);
      }

      .episode-info {
        flex-grow: 1;
      }

      .show-image {
        width: 4rem;
        display: block;
        height: auto;
        border-radius: var(--sl-border-radius-medium);
      }

      .episode-name {
        padding-top: var(--sl-spacing-x-small);
        padding-bottom: var(--sl-spacing-3x-small);
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-700);
      }

      .episode-summary {
        font-size: var(--sl-font-size-x-small);
        margin-block: var(--sl-spacing-2x-small);
        color: var(--sl-color-neutral-500);
      }

      .detail-list {
        list-style: none;
        padding: 0;
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-600);
      }

      .detail-list li {
        padding: var(--sl-spacing-3x-small) 0;
      }

      episode-name-tooltip {
        padding-bottom: 0;
      }

      .watched-date {
        font-size: var(--sl-font-size-x-small);
        margin-top: var(--sl-spacing-2x-small);
        color: var(--sl-color-neutral-700);
      }

      @media screen and (min-width: 640px) {
        .detail-list {
          display: flex;
          align-items: center;
          padding-top: var(--sl-spacing-2x-small);
        }

        .detail-list li:not(:last-child):after {
          content: ' · ';
          padding-right: var(--sl-spacing-2x-small);
        }
      }
    `,
  ];
}
