import { Router } from '@vaadin/router';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { addWatch } from '@/features/shows/shows-api';
import { sharedStyles } from '@/styles/shared-styles';
import { EpisodeDto } from '@/types';
import { createToastEvent, formatDate } from '@/utils';

import { getWatchList } from './wachlist-api';

import '@/components/info-tooltip';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@customElement('watchlist-page')
export class WatchListPage extends LitElement {
  @state() episodes?: EpisodeDto[];

  render() {
    return html`
      <app-layout icon="check-badge" headerTitle="Watch List" selected="watchlist">
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
            <a href="#" class="show-image-container" @click=${(event: Event) => this.handleClickShow(event, episode)}>
              <img
                class="show-image"
                src=${episode.show.imageMedium ?? '/images/empty-image.svg'}
                alt=${episode.show.name ?? 'Unknown show'}
              />
            </a>
            <div class="episode-info">
              <h1>${episode.show.name}</h1>
              <div class="episode-details">
                S${episode.seasonNumber} E${episode.number} &middot; ${formatDate(episode.aired)}
                ${episode.runtime ? html`&middot; ${episode.runtime}m` : null}
              </div>
              <div class="episode-title-info">
                <span>${episode.name}</span>
                <info-tooltip description=${ifDefined(episode.summary)}></info-tooltip>
              </div>
              <sl-button variant="default" size="small" @click=${() => this.handleWatch(episode)}>
                <sl-icon slot="prefix" library="hi-outline" name="eye"></sl-icon>
                Mark Watched
              </sl-button>
            </div>
          </div>
        `
      : null;
  }

  private handleClickShow(event: Event, episode: EpisodeDto) {
    event.preventDefault();
    Router.go(`/show/view/${episode.show?.id}`);
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

      .episode-info {
        flex-grow: 1;
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

      sl-button {
        margin-top: var(--sl-spacing-x-small);
      }
    `,
  ];
}
