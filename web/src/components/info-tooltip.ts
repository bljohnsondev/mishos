import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

@customElement('info-tooltip')
export class InfoTooltip extends LitElement {
  @property() description?: string;

  render() {
    return this.description
      ? html`
          <sl-tooltip content=${this.description} trigger="click">
            <sl-icon-button library="hi-outline" name="information-circle" label="Info"></sl-icon-button>
          </sl-tooltip>
        `
      : null;
  }

  static styles = css`
    :host {
      line-height: 0;
    }

    sl-icon-button {
      font-size: 1.2rem;
      color: var(--sl-color-neutral-800);
    }

    sl-icon-button::part(base) {
      padding: 0 var(--sl-spacing-small);
    }
  `;
}
