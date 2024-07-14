import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('header-button')
export class HeaderButton extends LitElement {
  @property({ type: Boolean }) active = false;

  render() {
    return html`
      <sl-button
        variant="text"
        size="medium"
        class=${classMap({ 'header-selected': this.active })}
      >
        <slot></slot>
      </sl-button>
    `;
  }

  static styles = css`
    sl-button::part(label) {
      color: var(--sl-color-neutral-800);
    }

    sl-button::part(label):hover {
      color: var(--sl-color-neutral-950);
    }

    sl-button.header-selected::part(label) {
      color: var(--sl-color-sky-500);
    }
  `;
}
