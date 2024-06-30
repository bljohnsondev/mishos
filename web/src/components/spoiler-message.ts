import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('spoiler-message')
export class SpoilerMessage extends LitElement {
  @property({ type: Boolean }) hide = false;
  @property() label = 'Show Description';

  @state() isHidden = false;

  render() {
    return when(
      this.isHidden,
      () => html`
        <sl-button class=${classMap({ hidden: !this.isHidden })} size="small" @click=${() => this.showDescription()}>
          ${this.label}
        </sl-button>
      `,
      () => html`
        <div class=${classMap({ summary: true, hidden: this.isHidden })}>
          <slot></slot>
        </div>
      `
    );
  }

  private showDescription() {
    this.isHidden = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // initialize the hidden state to the passed in prop value
    this.isHidden = this.hide;
  }

  static styles = css`
    .summary {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin-bottom: var(--sl-spacing-2x-small);
    }
  `;
}
