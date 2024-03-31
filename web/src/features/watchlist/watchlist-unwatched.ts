import { Router } from '@vaadin/router';
import { css, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '@/components/base-element';
import { watchEpisode } from '@/features/shows/shows-api';
import { sharedStyles } from '@/styles/shared-styles';
import { WatchlistEpisodeDto } from '@/types';
import { createToastEvent, formatAirTime } from '@/utils';

import { getWatchList } from './wachlist-api';

import '@/components/episode-name-tooltip';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@customElement('watchlist-unwatched')
export class WatchListUnwatched extends BaseElement {
  @state() episodes?: WatchlistEpisodeDto[];

  render() {
    return html`
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
    `;
  }

  private renderEpisode(episode: WatchlistEpisodeDto): TemplateResult | null {
    return episode
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
              <div class="episode-name">
                <episode-name-tooltip
                  name=${ifDefined(episode.name)}
                  description=${ifDefined(episode.summary)}
                ></episode-name-tooltip>
              </div>
              <ul class="detail-list">
                <li>S${episode.seasonNumber} E${episode.number}</li>
                ${episode.network ? html`<li>${episode.network}</li>` : null}
                ${episode.aired ? html`<li>${formatAirTime(episode.aired)}</li>` : null}
                ${episode.runtime ? html`<li>${episode.runtime}m</li>` : null}
              </ul>
              <sl-button
                class="watched-button"
                variant="neutral"
                size="small"
                @click=${() => this.handleWatch(episode)}
              >
                <sl-icon slot="prefix" library="hi-outline" name="eye"></sl-icon>
                Mark Watched
              </sl-button>
            </div>
          </div>
        `
      : null;
  }

  private handleClickShow(event: Event, episode: WatchlistEpisodeDto) {
    event.preventDefault();
    Router.go(`/show/view/${episode.showId}`);
  }

  async handleWatch(episode: WatchlistEpisodeDto) {
    if (episode && episode.id) {
      const episodeId = episode.id;
      await this.callApi(() => watchEpisode(episodeId, true));
      this.episodes = await this.callApi(() => getWatchList());
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
    this.episodes = await this.callApi(() => getWatchList());
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
        :is(h1) {
          margin: 0;
          padding: 0;
          font-weight: var(--sl-font-weight-semibold);
          font-size: var(--sl-font-size-small);
        }
      }

      .episode-info {
        flex-grow: 1;
      }

      .show-image-container {
        width: 6rem;
      }

      .show-image {
        display: block;
        width: 100%;
        height: auto;
        border-radius: var(--sl-border-radius-medium);
      }

      .episode-name {
        padding-top: var(--sl-spacing-2x-small);
      }

      .detail-list {
        list-style: none;
        padding: 0;
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-600);

        :is(li) {
          padding: var(--sl-spacing-3x-small) 0;
        }

        @media screen and (min-width: 640px) {
          display: flex;
          align-items: center;
          padding-top: var(--sl-spacing-2x-small);

          :is(li) {
            &:not(:last-child):after {
              content: ' · ';
              padding-right: var(--sl-spacing-2x-small);
            }
          }
        }
      }

      episode-name-tooltip {
        padding-bottom: 0;
      }

      .watched-button {
        margin-top: var(--sl-spacing-x-small);
      }
    `,
  ];
}
