import { consume } from '@lit/context';
import { Router } from '@vaadin/router';
import { type TemplateResult, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { BaseElement } from '@/components/base-element';
import { appContext } from '@/store/app-context';
import { sharedStyles } from '@/styles/shared-styles';
import type { AppStore, WatchlistEpisodeDto } from '@/types';
import { formatDate } from '@/utils';

import { getUpcomingList } from './upcoming-api';

import '@/components/spoiler-message';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import './calendar-card';

@customElement('upcoming-page')
export class UpcomingPage extends BaseElement {
  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appStore?: AppStore;

  @state() episodes?: WatchlistEpisodeDto[];

  render() {
    const hideSpoilers = this.appStore?.initData?.userConfig?.hideSpoilers;

    return html`
      <app-layout icon="calendar-days" headerTitle="Upcoming" selected="upcoming">
        <shows-search-form slot="header"></shows-search-form>
        <section class="content">
          ${
            this.episodes
              ? this.episodes.length > 0
                ? html`
                  <ul class="episode-list">
                    ${this.episodes.map(episode => {
                      return html`<li>${this.renderEpisode(episode, hideSpoilers)}</li>`;
                    })}
                  </ul>
                `
                : html`<div class="noupcoming">No upcoming episodes</div>`
              : null
          }
        </section>
      </app-layout>
    `;
  }

  private renderEpisode(episode: WatchlistEpisodeDto, hideSpoilers = false): TemplateResult | null {
    return episode && episode.aired
      ? html`
          <div class="episode">
            <div>
              <calendar-card .date=${episode.aired}></calendar-card>
              <div class="weekday">${formatDate(episode.aired, 'ddd')}</div>
            </div>
            <div>
              <a href="#" class="show-image-container" @click=${(event: Event) => this.handleClickShow(event, episode)}>
                <img
                  class="show-image"
                  src=${episode.imageMedium ?? '/images/empty-image.svg'}
                  alt=${episode.showName ?? 'Unknown episode'}
                />
              </a>
            </div>
            <div>
              <h1>${episode.showName}</h1>
              <div class="episode-name">
                ${episode.name}
              </div>
              ${when(
                episode.summary,
                () => html`<spoiler-message ?hide=${hideSpoilers}>${episode.summary}</spoiler-message>`,
                () => nothing
              )}
              <ul class="detail-list">
                <li>S${episode.seasonNumber} E${episode.number}</li>
                ${episode.network ? html`<li>${episode.network}</li>` : null}
                ${episode.aired ? html`<li>${formatDate(episode.aired, 'h:mm a')}</li>` : null}
                ${episode.runtime ? html`<li>${episode.runtime}m</li>` : null}
              </ul>
            </div>
          </div>
        `
      : null;
  }

  private handleClickShow(event: Event, episode: WatchlistEpisodeDto) {
    event.preventDefault();
    Router.go(`/show/view/${episode.showId}?season=${episode.seasonNumber}`);
  }

  async firstUpdated() {
    this.episodes = await this.callApi(() => getUpcomingList());
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
        padding-bottom: var(--sl-spacing-small);
      }

      .episode h1 {
        margin: 0;
        padding: 0;
        font-weight: var(--sl-font-weight-semibold);
        font-size: var(--sl-font-size-small);
      }

      .weekday {
        color: var(--sl-color-neutral-700);
        font-size: var(--sl-font-size-small);
        text-align: center;
        padding-top: var(--sl-spacing-2x-small);
      }

      .image-link {
        display: block;
        object-fit: contain;
      }

      .show-image {
        border-radius: var(--sl-border-radius-medium);
        max-width: 3rem;
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

      @media screen and (min-width: 640px) {
        .show-image {
          max-width: 5rem;
        }

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
