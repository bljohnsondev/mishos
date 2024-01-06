import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { logout } from '@/lib/auth';
import { sharedStyles } from '@/styles/shared-styles';
import { createEvent } from '@/utils';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  @property() icon?: string;
  @property() title!: string;
  @property() theme?: string;

  render() {
    return html`
      <header>
        <div class="icon">
          ${this.icon ? html`<sl-icon library="hi-outline" name="${this.icon}"></sl-icon>` : null}
          <span>${this.title}</span>
        </div>
        <slot></slot>
        <div class="right-menu">
          <loading-spinner></loading-spinner>
          <button title="Toggle Theme" class="reset-button" @click=${this.handleToggleTheme}>
            <sl-icon library="hi-solid" name=${this.theme === 'light' ? 'moon' : 'sun'}></sl-icon>
          </button>
          <sl-dropdown distance="8" @sl-select=${this.handleAccountSelect}>
            <sl-avatar slot="trigger" label="User"></sl-avatar>
            <sl-menu>
              <sl-menu-item value="logout">Logout</sl-menu-item>
            </sl-menu>
          </sl-dropdown>
        </div>
      </header>
      <sl-divider style="--color: var(--content-header-divider-color);"></sl-divider>
    `;
  }

  private handleAccountSelect(event: Event) {
    if (event && event instanceof CustomEvent && event.detail?.item?.value) {
      if (event.detail.item.value === 'logout') {
        logout();
      }
    }
  }

  private handleToggleTheme() {
    this.dispatchEvent(createEvent('toggle-theme'));
  }

  static styles = [
    sharedStyles,
    css`
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

      .right-menu {
        display: flex;
        align-items: center;
        gap: var(--sl-spacing-medium);
        @media screen and (min-width: 1024px) {
          margin-left: auto;
        }
        :is(button) {
          cursor: pointer;
          font-size: var(--sl-font-size-large);
          color: var(--sl-color-neutral-700);
        }
      }

      sl-dropdown {
        cursor: pointer;
      }

      sl-avatar {
        --size: 2rem;
      }

      sl-divider {
        margin: 0;
      }
    `,
  ];
}
