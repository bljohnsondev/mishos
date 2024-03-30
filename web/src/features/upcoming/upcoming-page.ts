import { Router } from '@vaadin/router';
import { css, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import { UpcomingEpisodeDto } from '@/types';
import { formatDate } from '@/utils';

import { getUpcomingList } from './upcoming-api';

import '@/components/episode-name-tooltip';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import './calendar-card';

@customElement('upcoming-page')
export class UpcomingPage extends BaseElement {
  @state() episodes?: UpcomingEpisodeDto[];

  render() {
    return html`
      <app-layout icon="calendar-days" headerTitle="Upcoming" selected="upcoming">
        <shows-search-form slot="header"></shows-search-form>
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
              : html`<div class="noupcoming">No upcoming episodes</div>`
            : null}
        </section>
      </app-layout>
    `;
  }

  private renderEpisode(episode: UpcomingEpisodeDto): TemplateResult | null {
    return episode && episode.show && episode.aired
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
                  src=${episode.show.imageMedium ?? '/images/empty-image.svg'}
                  alt=${episode.show.name ?? 'Unknown episode'}
                />
              </a>
            </div>
            <div>
              <h1>${episode.show.name}</h1>
              <div class="episode-name">
                <episode-name-tooltip
                  name=${ifDefined(episode.name)}
                  description=${ifDefined(episode.summary)}
                ></episode-name-tooltip>
              </div>
              <ul class="detail-list">
                <li>S${episode.seasonNumber} E${episode.number}</li>
                ${episode.show?.network ? html`<li>${episode.show.network}</li>` : null}
                ${episode.aired ? html`<li>${formatDate(episode.aired, 'h:mm a')}</li>` : null}
                ${episode.runtime ? html`<li>${episode.runtime}m</li>` : null}
              </ul>
            </div>
          </div>
        `
      : null;
  }

  private handleClickShow(event: Event, episode: UpcomingEpisodeDto) {
    event.preventDefault();
    Router.go(`/show/view/${episode.show?.ID}`);
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
        :is(h1) {
          margin: 0;
          padding: 0;
          font-weight: var(--sl-font-weight-semibold);
          font-size: var(--sl-font-size-small);
        }
      }

      .weekday {
        color: var(--sl-color-neutral-700);
        font-size: var(--sl-font-size-small);
        text-align: center;
        padding-top: var(--sl-spacing-2x-small);
      }

      .episode-name {
        padding-top: var(--sl-spacing-2x-small);
      }

      .image-link {
        display: block;
        object-fit: contain;
      }

      .show-image {
        border-radius: var(--sl-border-radius-medium);
        max-width: 3rem;
        @media screen and (min-width: 640px) {
          max-width: 5rem;
        }
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
    `,
  ];
}
