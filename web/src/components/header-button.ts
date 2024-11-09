import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('header-button')
export class HeaderButton extends LitElement {
  @property({ type: Boolean }) active = false;

  render() {
    return html`
      <sl-button
        size="medium"
        class=${classMap({ 'header-selected': this.active })}
      >
        <slot></slot>
      </sl-button>
    `;
  }

  static styles = css`
    sl-button::part(base) {
      background-color: transparent;
    }

    sl-button:hover::part(base) {
      color: var(--sl-color-neutral-900);
      border-color: var(--sl-color-neutral-500);
    }

    sl-button.header-selected::part(base) {
      border-color: var(--sl-color-sky-300);
    }

    sl-button.header-selected::part(label) {
      color: var(--sl-color-sky-700);
    }
  `;
}
