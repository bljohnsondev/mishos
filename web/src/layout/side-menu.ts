import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '@/components/base-element';
import { createEvent } from '@/utils';

import type { SideMenuItem } from './side-menu-item';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@customElement('side-menu')
export class SideMenu extends BaseElement {
  @property({ attribute: false }) items?: SideMenuItem[];
  @property() selected?: string;
  @property({ type: Boolean }) narrow = false;

  render() {
    return html`
      <ul class=${classMap({ narrow: this.narrow })}>
        <li class="site-title">
          <span><sl-icon library="local" name="television" aria-hidden="true"></sl-icon></span>
          <div>MISHOS</div>
        </li>
        ${
          this.items
            ? this.items.map(item => {
                if (item.name !== 'divider') {
                  const icon = html`
                    <sl-icon
                      library=${ifDefined(item.iconLibrary)}
                      name=${ifDefined(item.iconName)}
                    ></sl-icon>
                  `;

                  return html`
                    <li>
                      <a
                        href="#"
                        title=${ifDefined(this.narrow ? item.tooltip : undefined)}
                        class=${this.selected === item.name ? 'selected' : ''}
                        @click=${() => this.handleSideItem(item)}
                      >
                        ${icon}
                        ${item.tooltip}
                      </a>
                    </li>
                  `;
                }

                return html`<sl-divider style="--color: var(--sm-divider-color);"></sl-divider>`;
              })
            : null
        }
        <li class="collapse">
          <a href="#" @click=${this.handleToggleNarrow}>
            <sl-icon
              library="hi-outline"
              name=${this.narrow ? 'chevron-double-right' : 'chevron-double-left'}
            ></sl-icon>
            Collapse
          </a>
        </li>
      </ul>
    `;
  }

  private handleToggleNarrow() {
    //this.narrow = !this.narrow;
    this.dispatchCustomEvent('side-menu-toggle');
  }

  private handleSideItem(item: SideMenuItem) {
    if (item.route) {
      this.dispatchEvent(createEvent('side-menu-select', { item }));
    } else if (item.action) {
      item.action();
    }
  }

  static styles = [
    css`
      :host {
        border-right: 1px solid var(--sm-border-color);
        background-color: var(--sm-bg-color);
      }

      ul {
        position: sticky;
        top: 0;
        z-index: 1;
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 170px;
        transition: width 500ms ease-in-out;
        height: 100vh;
      }

      ul.narrow {
        width: 55px;
      }

      li {
        margin-left: 15px;
      }

      li.collapse {
        margin-top: auto;
        padding-bottom: 15px;
      }

      li.site-title {
        padding-top: 20px;
        padding-bottom: 5px;
        display: flex;
        align-items: center;
        font-weight: var(--sl-font-weight-semibold);
        letter-spacing: var(--sl-letter-spacing-loose);
        color: var(--sl-color-green-900);
      }

      li.site-title span {
        line-height: 0;
      }

      li.site-title sl-icon {
        height: 25px;
        width: 25px;
        color: var(--sl-color-green-500);
      }

      a {
        display: flex;
        align-items: center;
        width: 200px;
        font-size: var(--sl-font-size-small);
        text-decoration: none;
        color: var(--sl-color-neutral-700);
      }

      a:hover {
        color: var(--sl-color-neutral-900);
      }

      a.selected {
        color: var(--sm-button-selected-text);
      }

      sl-icon {
        width: 25px;
        height: 25px;
        margin-right: 20px;
      }

      sl-divider {
        margin: 0 var(--sl-spacing-medium);
      }

      sl-tooltip {
        z-index: 999;
      }
    `,
  ];
}
