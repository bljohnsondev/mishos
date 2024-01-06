import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { EpisodeDto } from '@/types';
import { createEvent, formatDate } from '@/utils';

import '@shoelace-style/shoelace/dist/components/icon/icon';

dayjs.extend(isSameOrBefore);

@customElement('episode-card')
export class EpisodeCard extends LitElement {
  @property({ attribute: false }) episode!: EpisodeDto;
  @property({ type: Boolean }) preview: boolean = false;

  render() {
    return html`
      <div class="episode">
        <div class="ep-header">
          <span>S${this.episode.seasonNumber} E${this.episode.number}</span>
          <span>${formatDate(this.episode.aired)}</span>
        </div>
        <div>${this.episode.name}</div>
        ${this.hasAired()
          ? !this.preview
            ? html`
                <button
                  class=${`watch-toggle ${this.episode.watched ? 'watched' : 'unwatched'}`}
                  @click=${this.handleToggleWatched}
                >
                  <sl-icon library="hi-outline" name=${this.episode.watched ? 'eye' : 'eye-slash'}></sl-icon>
                  ${this.episode.watched ? 'Watched' : 'Unwatched'}
                </button>
              `
            : null
          : html` <div class="upcoming">Upcoming episode</div> `}
      </div>
    `;
  }

  private async handleToggleWatched() {
    if (this.episode?.id) {
      this.dispatchEvent(createEvent('toggle-watched', { episodeId: this.episode.id, watched: !this.episode.watched }));
    }
  }

  private hasAired() {
    return dayjs(this.episode.aired).isSameOrBefore(dayjs());
  }

  static styles = css`
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
      display: flex;
      align-items: center;
      color: var(--sl-color-neutral-600);
      :is(span:last-child) {
        margin-left: auto;
      }
    }

    .watch-toggle {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--sl-spacing-x-small);
      padding: var(--sl-spacing-x-small);
      border-radius: var(--sl-border-radius-medium);
    }

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

    .upcoming {
      color: var(--sl-color-neutral-500);
    }
  `;
}
