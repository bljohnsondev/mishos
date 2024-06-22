import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { LitElement, css, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { sharedStyles } from '@/styles/shared-styles';
import type { ShowDto } from '@/types';
import { createEvent, formatDate } from '@/utils';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';

import './episode-card';

@customElement('show-details')
export class ShowDetails extends LitElement {
  @query('form') form!: HTMLFormElement;

  @property({ attribute: false }) show?: ShowDto;
  @property({ type: Number }) seasonNumber?: number;
  @property({ type: Boolean }) preview = false;

  @state() season: number = this.seasonNumber ?? 1;

  render() {
    return this.show ? this.renderShow() : null;
  }

  private renderShow() {
    if (!this.show) return null;

    const currentSeason = this.show.seasons?.find(s => s.number === this.season);

    return html`
      <section>
        <div class="show-header">
          <h1>${this.show.name}</h1>
          ${
            this.show.id
              ? html`
                <div class="show-header-buttons">
                  <sl-button variant="warning" size="small" @click=${this.handleClickRemove}>
                    <sl-icon slot="prefix" library="hi-outline" name="bookmark-slash"></sl-icon>
                    Remove
                  </sl-button>
                  <sl-button size="small" class="refresh-button" @click=${this.handleClickRefresh}>Refresh</sl-button>
                </div>
              `
              : html`
                <sl-button variant="default" size="small" @click=${this.handleClickAdd}>
                  <sl-icon slot="prefix" library="hi-outline" name="bookmark"></sl-icon>
                  Add
                </sl-button>
              `
          }
        </div>
        <div class="detail-content">
          <div>
            ${
              this.show.imageMedium
                ? html` <img src=${this.show.imageMedium} alt=${ifDefined(this.show.name)} class="show-image" /> `
                : html` <div class="no-image-placeholder"></div> `
            }
            <a href=${ifDefined(this.show.providerUrl)} class="provider-link" target="_blank">view at tvmaze.com</a>
          </div>
          <div class="right-content">
            <p class="summary">${this.show.summary}</p>
            <ul class="show-info">
              ${this.show.network ? html`<li>${this.show.network}</li>` : null}
              ${this.show.premiered ? html`<li>${formatDate(this.show.premiered)}</li>` : null}
              ${this.show.status ? html`<li>${this.show.status}</li>` : null}
              ${
                this.show.imdbId
                  ? html`<li><button class="imdb-button" @click=${this.handleImdbButton}>IMDb</button></li>`
                  : null
              }
            </ul>
            <form>
              <sl-select
                name="season"
                value=${this.season}
                class="seasons-select"
                @sl-change=${this.handleChangeSeason}
              >
                ${this.show.seasons?.map(
                  season => html` <sl-option value=${ifDefined(season.number)}>Season ${season.number}</sl-option> `
                )}
              </sl-select>
              ${
                !this.preview
                  ? html`
                    <sl-switch
                      name="previous"
                      value="1"
                      size="small"
                      class="previous"
                      @sl-change=${this.handleChangePrevious}
                    >
                      Mark Previous
                    </sl-switch>
                  `
                  : null
              }
            </form>
            ${
              currentSeason && currentSeason.episodes && currentSeason.episodes.length > 0
                ? html`
                  <div class="episode-list">
                    ${currentSeason.episodes.map(
                      episode => html`<episode-card .episode=${episode} ?preview=${this.preview}></episode-card>`
                    )}
                  </div>
                `
                : html`<div class="no-episodes">No episodes available for this show or season</div>`
            }
          </div>
        </div>
      </section>
    `;
  }

  private handleImdbButton() {
    window.open(`https://www.imdb.com/title/${this.show?.imdbId}`, '_blank');
  }

  private handleClickAdd(event: Event) {
    event.preventDefault();
    this.dispatchEvent(createEvent('add-show', this.show));
  }

  private handleClickRefresh() {
    if (this.show) {
      this.dispatchEvent(createEvent('refresh-show', this.show?.id));
    }
  }

  private handleClickRemove(event: Event) {
    event.preventDefault();
    this.dispatchEvent(createEvent('remove-show', this.show));
  }

  private handleChangeSeason(event: Event) {
    event.preventDefault();
    const data = serialize(this.form);
    if (data.season) {
      this.season = Number.parseInt(data.season.toString());
    }
  }

  private handleChangePrevious(event: Event) {
    event.preventDefault();
    const data = serialize(this.form);
    this.dispatchEvent(createEvent('toggle-previous', data.previous === '1'));
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    // on show change reset the toggle previous switch
    if (this.form && changedProperties.has('show')) {
      this.form.reset();
    }
  }

  static styles = [
    sharedStyles,
    css`
      .show-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--sl-spacing-medium);
        margin-bottom: var(--sl-spacing-medium);
        @media screen and (min-width: 768px) {
          flex-direction: row;
          gap: var(--sl-spacing-x-large);
        }
        :is(h1) {
          display: block;
          font-size: var(--sl-font-size-large);
          margin: 0;
        }
      }

      .show-header-buttons {
        display: flex;
        align-items: center;
        flex-grow: 1;
        align-self: stretch;
      }

      .refresh-button {
        margin-left: auto;
      }

      .right-content {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      .summary {
        margin: 0;
      }

      .show-info {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-600);
      }

      .show-info li:not(:first-child):before {
        content: '·';
        padding: 0 var(--sl-spacing-small);
      }

      .show-image {
        border-radius: var(--sl-border-radius-medium);
      }

      .provider-link {
        display: block;
        text-align: center;
        font-size: var(--sl-font-size-small);
        text-decoration: none;
        color: var(--sl-color-neutral-500);
        margin-top: var(--sl-spacing-x-small);
      }

      form {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        .previous::part(label) {
          font-size: var(--sl-font-size-small);
        }
        @media screen and (min-width: 768px) {
          align-items: center;
          flex-direction: row;
          .previous {
            margin-left: auto;
          }
        }
      }

      .detail-content {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        @media screen and (min-width: 1024px) {
          flex-direction: row;
        }
      }

      .seasons-select {
        width: 200px;
      }

      .episode-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--sl-spacing-medium);
      }

      .no-episodes {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-700);
      }

      .imdb-button {
        all: unset;
        cursor: pointer;
        font-size: var(--sl-font-size-x-small);
        padding: var(--sl-spacing-3x-small) var(--sl-spacing-x-small);
        background-color: var(--sl-color-yellow-600);
        border: 1px solid var(--sl-color-yellow-700);
        border-radius: var(--sl-border-radius-medium);
        color: black;
        &:hover {
          background-color: var(--sl-color-yellow-500);
          border: 1px solid var(--sl-color-yellow-600);
        }
      }
    `,
  ];
}
