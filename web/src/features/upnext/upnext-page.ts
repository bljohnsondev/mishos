import { Router } from '@vaadin/router';
import dayjs from 'dayjs';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { sharedStyles } from '@/styles/shared-styles';
import { UpNextEpisodeDto } from '@/types';

import { getUpNextList } from './upnext-api';

import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import './calendar-card';

@customElement('upnext-page')
export class UpNextPage extends LitElement {
  @state() episodes?: UpNextEpisodeDto[];

  render() {
    return html`
      <app-layout icon="tv" headerTitle="Up Next" selected="upnext">
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
              : html`<div class="nonext">No upcoming episodes</div>`
            : null}
        </section>
      </app-layout>
    `;
  }

  private renderEpisode(episode: UpNextEpisodeDto): TemplateResult | null {
    return episode && episode.show
      ? html`
          <div class="episode">
            <calendar-card .date=${episode.aired}></calendar-card>
            <a href="#" class="show-image-container" @click=${(event: Event) => this.handleClickShow(event, episode)}>
              <img class="show-image" src=${episode.show.imageMedium} alt=${episode.show.name} />
            </a>
            <div>
              <h1>${episode.show.name}</h1>
              <div class="episode-details">
                S${episode.seasonNumber} E${episode.number} &middot; ${this.formatWeekday(episode.aired)}
              </div>
              <div class="episode-title">${episode.name}</div>
            </div>
          </div>
        `
      : null;
  }

  private formatWeekday(date?: Date): TemplateResult | null {
    return date ? html`${dayjs(date).format('dddd')}` : null;
  }

  private handleClickShow(event: Event, episode: UpNextEpisodeDto) {
    event.preventDefault();
    Router.go(`/show/view/${episode.show?.id}`);
  }

  async firstUpdated() {
    this.episodes = await getUpNextList();
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
        width: 50px;
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
    `,
  ];
}
