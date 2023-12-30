import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/badge/badge';
import { createEvent } from '@/utils';

export type ShowCardBadgeVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger';

export interface ShowCardBadge {
  variant: ShowCardBadgeVariant;
  label: string;
}

@customElement('show-card')
export class ShowCard extends LitElement {
  @property({ type: String }) identifier?: string;
  @property({ type: String }) image?: string;
  @property({ type: String }) name?: string;
  @property({ type: String }) network?: string;
  @property({ attribute: false }) badge?: ShowCardBadge;

  render() {
    return html`
      <a href="#" class="link" @click=${this.handleClick}>
        <img src=${this.image} alt=${this.name} />
        <div class="details">
          <div class="name">${this.name}</div>
          ${this.network ? html`<div class="network">${this.network}</div>` : null}
          ${this.badge
            ? html`<sl-badge variant=${this.badge.variant ?? 'success'}>${this.badge.label}</sl-badge>`
            : null}
        </div>
      </a>
    `;
  }

  private handleClick(event: Event) {
    event.preventDefault();
    this.dispatchEvent(createEvent('select-show', this.identifier));
  }

  static styles = css`
    .link {
      position: relative;
      min-height: 100%;
      display: inline-block;
      background-color: var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      width: var(--show-card-width);
      font-size: var(--sl-font-size-small);
      text-decoration: none;
      transition: transform 200ms;
      &:hover {
        transform: scale(1.02);
        filter: brightness(105%);
      }
    }

    img {
      width: var(--show-card-width);
      border-top-left-radius: var(--sl-border-radius-large);
      border-top-right-radius: var(--sl-border-radius-large);
      object-fit: contain;
    }

    .details {
      padding: var(--sl-spacing-small);
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-x-small);
    }

    .name {
      color: var(--sl-color-neutral-800);
      letter-spacing: var(--sl-letter-spacing-denser);
      font-weight: var(--sl-font-weight-semibold);
    }

    .network {
      letter-spacing: var(--sl-letter-spacing-denser);
      color: var(--sl-color-neutral-600);
    }

    sl-badge::part(base) {
      position: absolute;
      top: var(--sl-spacing-small);
      left: var(--sl-spacing-small);
    }
  `;
}
