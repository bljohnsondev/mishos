import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

@customElement('episode-name-tooltip')
export class EpisodeNameTooltip extends LitElement {
  @property() name!: string;
  @property() description?: string;

  render() {
    return this.description
      ? html`
          <sl-tooltip content=${this.description} trigger="click">
            <sl-button variant="text">${this.name}</sl-button>
          </sl-tooltip>
        `
      : html` <span class="name-only">${this.name}</span> `;
  }

  static styles = css`
    sl-button::part(base) {
      min-height: 0;
      white-space: normal;
      word-wrap: break-word;
      text-align: left;
    }

    sl-button::part(label) {
      line-height: 1rem;
      padding: var(--sl-spacing-3x-small) 0;
      color: var(--sl-color-sky-800);
    }

    .name-only {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-800);
    }
  `;
}
