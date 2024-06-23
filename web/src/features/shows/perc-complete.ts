import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('perc-complete')
export class PercentComplete extends LitElement {
  @property({ type: Number }) percent = 0;

  render() {
    return html`
      <div class="perc-container">
        <div class="complete" style="width: ${this.percent}%"></div>
        <div class="rest" style="width: ${100 - this.percent}%"></div>
      </div>
    `;
  }

  static styles = css`
    .perc-container {
      height: 0.3rem;
      display: flex;
    }

    .complete {
      background-color: var(--sl-color-green-500);
    }

    .rest {
      background-color: var(--sl-color-neutral-500);
    }
  `;
}
