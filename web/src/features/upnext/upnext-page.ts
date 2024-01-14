import { Router } from '@vaadin/router';
import dayjs from 'dayjs';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { sharedStyles } from '@/styles/shared-styles';
import { UpNextEpisodeDto } from '@/types';

import { getUpNextList } from './upnext-api';

import '@/components/info-tooltip';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import './calendar-card';

@customElement('upnext-page')
export class UpNextPage extends LitElement {
  @state() episodes?: UpNextEpisodeDto[];

  render() {
    return html`
      <app-layout icon="calendar-days" headerTitle="Up Next" selected="upnext">
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
    return episode && episode.show && episode.aired
      ? html`
          <div class="episode">
            <calendar-card .date=${episode.aired}></calendar-card>
            <a href="#" class="show-image-container" @click=${(event: Event) => this.handleClickShow(event, episode)}>
              <img
                class="show-image"
                src=${episode.show.imageMedium ?? '/images/empty-image.svg'}
                alt=${episode.show.name ?? 'Unknown episode'}
              />
            </a>
            <div class="episode-info">
              <h1>${episode.show.name}</h1>
              <div class="episode-details">
                S${episode.seasonNumber} E${episode.number}
                ${episode.aired
                  ? html` &middot; ${this.formatWeekday(episode.aired)} &middot; ${this.formatAirTime(episode.aired)} `
                  : null}
                ${episode.runtime ? html`&middot; ${episode.runtime}m` : null}
              </div>
              <div class="episode-title-info">
                <span>${episode.name}</span>
                <info-tooltip description=${ifDefined(episode.summary)}></info-tooltip>
              </div>
            </div>
          </div>
        `
      : null;
  }

  private formatWeekday(date?: Date): TemplateResult | null {
    return date ? html`${dayjs(date).format('dddd')}` : null;
  }

  private formatAirTime(date?: Date): TemplateResult | null {
    if (date) {
      return html`${dayjs(date).format('h:mm a')}`;
    } else return null;
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

      .episode-info {
        width: 100%;
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

      .placeholder-image {
        width: 50px;
        height: 70px;
        background-color: var(--sl-color-neutral-300);
        border-radius: var(--sl-border-radius-medium);
      }

      .episode-details {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-500);
        margin: var(--sl-spacing-x-small) 0;
      }
    `,
  ];
}
