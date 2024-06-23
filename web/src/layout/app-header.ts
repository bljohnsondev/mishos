import { consume } from '@lit/context';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { appContext } from '@/store/app-context';
import { sharedStyles } from '@/styles/shared-styles';
import type { AppStore } from '@/types';

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

  render() {
    return html`
      <header>
        <div class="icon">
          ${
            this.icon ? html`<sl-icon library=${this.iconlibrary ?? 'hi-outline'} name="${this.icon}"></sl-icon>` : null
          }
          <span>${this.title}</span>
        </div>
        <slot></slot>
        <div class="right-menu">
          <loading-spinner ?loading=${this.appStore?.loading}></loading-spinner>
        </div>
      </header>
      <sl-divider style="--color: var(--content-header-divider-color);"></sl-divider>
    `;
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
        min-height: 2.5rem;
      }

      .icon {
        display: flex;
        align-items: center;
        gap: var(--sl-spacing-small);
      }

      .icon span {
        font-size: var(--sl-font-size-small);
        color: var(--header-title-color);
        font-weight: var(--sl-font-weight-semibold);
      }

      .icon sl-icon {
        color: var(--sl-color-blue-700);
        font-size: var(--sl-font-size-large);
      }

      .right-menu {
        display: flex;
        align-items: center;
        gap: var(--sl-spacing-medium);
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

      @media screen and (min-width: 1024px) {
        header {
          flex-direction: row;
          padding-left: var(--sl-spacing-large);
          padding-right: var(--sl-spacing-large);
        }

        .right-menu {
          margin-left: auto;
        }
      }
    `,
  ];
}
