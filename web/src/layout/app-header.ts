import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  @property() icon?: string;
  @property() title!: string;

  render() {
    return html`
      <header>
        <div class="icon">
          ${this.icon ? html`<sl-icon library="hi-outline" name="${this.icon}"></sl-icon>` : null}
          <span>${this.title}</span>
        </div>
        <slot></slot>
      </header>
      <sl-divider style="--color: var(--content-header-divider-color);"></sl-divider>
    `;
  }

  static styles = css`
    header {
      padding: var(--sl-spacing-small);
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: var(--sl-spacing-medium);
      background-color: var(--content-header-bg-color);
      @media screen and (min-width: 1024px) {
        flex-direction: row;
        padding-left: var(--sl-spacing-large);
        padding-right: var(--sl-spacing-large);
      }
    }

    sl-divider {
      margin: 0;
    }

    .icon {
      display: flex;
      align-items: center;
      gap: var(--sl-spacing-small);
      :is(span) {
        font-size: var(--sl-font-size-small);
        color: var(--header-title-color);
        font-weight: var(--sl-font-weight-semibold);
      }
      :is(sl-icon) {
        color: var(--sl-color-blue-700);
        font-size: var(--sl-font-size-large);
      }
    }
  `;
}
