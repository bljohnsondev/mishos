import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { sharedStyles } from '@/styles/shared-styles';
import { EpisodeDto } from '@/types';
import { createEvent, formatDate } from '@/utils';

import '@/components/episode-name-tooltip';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

dayjs.extend(isSameOrBefore);

@customElement('episode-card')
export class EpisodeCard extends LitElement {
  @property({ attribute: false }) episode!: EpisodeDto;
  @property({ type: Boolean }) preview: boolean = false;

  render() {
    return html`
      <div class="episode">
        <div class="ep-header">
          S${this.episode.seasonNumber} E${this.episode.number} &middot; ${formatDate(this.episode.aired)}
          ${this.episode.runtime ? html`&middot; ${this.episode.runtime}m` : null}
        </div>
        <div class="title-container">
          <episode-name-tooltip
            name=${ifDefined(this.episode.name)}
            description=${ifDefined(this.episode.summary)}
          ></episode-name-tooltip>
        </div>
        ${this.hasAired()
          ? !this.preview
            ? html`
                <sl-button
                  size="small"
                  variant=${this.episode.watched ? 'default' : 'neutral'}
                  class=${`watched-button ${this.episode.watched ? 'watched' : 'unwatched'}`}
                  @click=${this.handleWatch}
                >
                  <sl-icon
                    slot="prefix"
                    library="hi-outline"
                    name=${this.episode.watched ? 'eye' : 'eye-slash'}
                  ></sl-icon>
                  ${this.episode.watched ? 'Watched' : 'Unwatched'}
                </sl-button>
              `
            : null
          : html` <div class="upcoming">Upcoming episode</div> `}
      </div>
    `;
  }

  private async handleWatch() {
    if (this.episode?.id) {
      this.dispatchEvent(
        createEvent(this.episode.watched ? 'unwatch-episode' : 'watch-episode', {
          episodeId: this.episode.id,
        })
      );
    }
  }

  private hasAired() {
    return dayjs(this.episode.aired).isSameOrBefore(dayjs());
  }

  static styles = [
    sharedStyles,
    css`
      .episode {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--sl-spacing-x-small);
        width: 240px;
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-medium);
        padding: var(--sl-spacing-medium);
        font-size: var(--sl-font-size-small);
      }

      .ep-header {
        width: 100%;
        color: var(--sl-color-neutral-600);
      }

      .title-container {
        width: 100%;
      }

      .watched-button::part(label),
      .watched-button::part(prefix) {
        font-size: var(--sl-font-size-x-small);
      }

      .watched::part(base) {
        background-color: var(--sl-color-green-300);
      }

      .watched::part(base):hover {
        border-color: var(--sl-color-green-400);
      }

      .watched::part(label),
      .watched::part(prefix) {
        color: var(--sl-color-neutral-900);
        &:hover {
          color: var(--sl-color-neutral-900);
        }
      }

      /*
      .watched {
        background-color: var(--sl-color-green-300);
        border: 1px solid var(--sl-color-green-100);
        color: var(--sl-color-neutral-900);
      }

      .unwatched {
        background-color: transparent;
        border: 1px solid var(--sl-color-neutral-300);
        color: var(--sl-color-neutral-600);
      }
      */

      .upcoming {
        color: var(--sl-color-neutral-500);
      }
    `,
  ];
}
