import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/badge/badge';
import '@shoelace-style/shoelace/dist/components/card/card';

export type ShowCardBadgeVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger';

export interface ShowCardBadge {
  variant: ShowCardBadgeVariant;
  label: string;
}

@customElement('show-card')
export class ShowCard extends LitElement {
  @property({ type: String }) image?: string;
  @property({ type: String }) name?: string;
  @property({ type: String }) network?: string;
  @property({ attribute: false }) badge?: ShowCardBadge;

  render() {
    return html`
      <sl-card class="show-card">
        ${this.image
          ? html`<img slot="image" src=${this.image} alt=${this.name} />`
          : html`<div slot="image" class="no-image"></div>`}
        <div>
          <strong>${this.name}</strong>
          <small>${this.network}</small>
          ${this.badge
            ? html`<sl-badge variant=${this.badge.variant ?? 'success'}>${this.badge.label}</sl-badge>`
            : null}
        </div>
      </sl-card>
    `;
  }

  static styles = css`
    sl-card::part(body) {
      padding: var(--sl-spacing-small);
    }

    .show-card {
      position: relative;
      max-width: 200px;
      :is(div) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-small);
        :is(strong) {
          font-size: var(--sl-font-size-medium);
          font-weight: var(--sl-font-weight-semibold);
        }
        :is(small) {
          color: var(--sl-color-neutral-600);
        }
      }
    }

    .no-image {
      width: 200px;
      height: 280px;
      background-color: var(--sl-color-neutral-300);
    }
  `;
}