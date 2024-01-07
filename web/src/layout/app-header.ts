import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { logout } from '@/lib/auth';
import { appContext } from '@/store/app-context';
import { sharedStyles } from '@/styles/shared-styles';
import { AppStore } from '@/types';
import { createEvent } from '@/utils';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

import '@/components/loading-spinner';

@customElement('app-header')
export class AppHeader extends LitElement {
  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appStore?: AppStore;

  @property() iconlibrary?: string;
  @property() icon?: string;
  @property() title!: string;
  @property() theme?: string;

  render() {
    return html`
      <header>
        <div class="icon">
          ${this.icon
            ? html`<sl-icon library=${this.iconlibrary ?? 'hi-outline'} name="${this.icon}"></sl-icon>`
            : null}
          <span>${this.title}</span>
        </div>
        <slot></slot>
        <div class="right-menu">
          <loading-spinner ?loading=${this.appStore?.loading}></loading-spinner>
          <button title="Toggle Theme" class="reset-button toggle-theme" @click=${this.handleToggleTheme}>
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
        .toggle-theme {
          cursor: pointer;
          font-size: var(--sl-font-size-x-large);
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
