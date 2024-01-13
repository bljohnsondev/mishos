import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { createEvent } from '../utils';

import { SideMenuItem } from './side-menu-item';

import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

@customElement('side-menu')
export class SideMenu extends LitElement {
  @property({ attribute: false })
  items?: SideMenuItem[];

  @property()
  selected?: string;

  render() {
    return html`
      <section>
        <div class="logo-container">
          <div class="logo">
            <sl-icon library="local" name="television"></sl-icon>
          </div>
        </div>
        <sl-divider style="--color: var(--sm-divider-color);"></sl-divider>
        <ul class="main-menu">
          ${this.items
            ? this.items.map(
                item => html`
                  <li class=${this.selected === item.name ? 'selected' : null}>
                    <sl-tooltip content=${item.tooltip} placement="right">
                      <sl-icon-button
                        library=${item.iconLibrary}
                        name=${item.iconName}
                        @click=${() => this.navigate(item)}
                      ></sl-icon-button>
                    </sl-tooltip>
                  </li>
                `
              )
            : null}
        </ul>
      </section>
    `;
  }

  private navigate(item: SideMenuItem) {
    this.dispatchEvent(createEvent('side-menu-select', { item }));
  }

  static styles = [
    css`
      :host {
        border-right: 1px solid var(--sm-border-color);
        background-color: var(--sm-bg-color);
      }

      .logo-container {
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logo {
        height: 35px;
        width: 35px;
        font-size: 1.8rem;
        margin: 0 var(--sl-spacing-medium);
        color: var(--sl-color-green-500);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      sl-divider {
        margin: 0 var(--sl-spacing-medium);
      }

      .divider {
        padding: 0 1rem;
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-small);
        margin: var(--sl-spacing-medium) 0;
        padding: 0;
        list-style: none;
      }

      li {
        display: block;
        align-self: center;
      }

      sl-icon-button::part(base) {
        padding: var(--sl-spacing-x-small);
        font-size: 1.4rem;
        color: var(--sm-button-text);
        transition: background-color 150ms ease;
      }

      sl-icon-button::part(base):hover {
        color: var(--sl-color-neutral-700);
        background-color: var(--sl-color-neutral-200);
      }

      li.selected sl-icon-button::part(base) {
        color: var(--sm-button-selected-text);
        background-color: var(--sm-button-selected-bg);
      }

      sl-tooltip::part(body),
      sl-tooltip::part(base__arrow) {
        background-color: var(--sm-tooltip-bg);
        color: var(--sm-tooltip-text);
      }

      sl-tooltip::part(body) {
        padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
      }
    `,
  ];
}
