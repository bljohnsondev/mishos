import { Router } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { sideMenuItems } from '@/layout/side-menu-items';
import { getTheme, setTheme } from '@/utils';

import './app-header';
import './side-menu';

@customElement('app-layout')
export class AppLayout extends LitElement {
  @property() iconLibrary?: string;
  @property() icon?: string;
  @property() headerTitle?: string;
  @property() selected?: string;

  @state() theme?: string = getTheme();

  constructor() {
    super();
    this.addEventListener('side-menu-select', this.handleSideMenuSelect);
  }

  render() {
    return html`
      <main class="app-container">
        <side-menu .items=${sideMenuItems} selected=${ifDefined(this.selected)}></side-menu>
        <div class="content">
          <app-header
            iconLibrary=${ifDefined(this.iconLibrary)}
            icon=${this.icon ?? 'tv'}
            title=${this.headerTitle ?? 'Shows'}
            theme=${ifDefined(this.theme)}
          >
            <slot name="header"></slot>
          </app-header>
          <slot></slot>
        </div>
      </main>
      <slot name="footer"></slot>
    `;
  }

  private handleSideMenuSelect(event: Event) {
    if (event && event instanceof CustomEvent && event.detail?.item && event.detail.item.route) {
      Router.go(event.detail.item.route);
    }
  }

  private initializeTheme() {
    const theme = getTheme();
    setTheme(theme);
  }

  firstUpdated() {
    this.initializeTheme();
  }

  static styles = css`
    .app-container {
      box-sizing: border-box;
      display: flex;
      align-items: stretch;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }

    .content {
      background-color: var(--content-bg-color);
      flex-grow: 1;
    }
  `;
}
