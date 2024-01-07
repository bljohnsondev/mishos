import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { sideMenuItems } from '@/layout/side-menu-items';
import { getTheme, setTheme } from '@/utils';

import './app-header';
import './side-menu';

@customElement('app-layout')
export class AppLayout extends LitElement {
  @property() icon?: string;
  @property() headerTitle?: string;
  @property() selected?: string;

  @state() theme?: string = getTheme();

  constructor() {
    super();
    this.addEventListener('toggle-theme', this.handleToggleTheme);
  }

  render() {
    return html`
      <main class="app-container">
        <side-menu .items=${sideMenuItems} selected=${this.selected}></side-menu>
        <div class="content">
          <app-header icon=${this.icon ?? 'tv'} title=${this.headerTitle ?? 'Shows'} theme=${this.theme}>
            <slot name="header"></slot>
          </app-header>
          <slot></slot>
        </div>
      </main>
      <slot name="footer"></slot>
    `;
  }

  private initializeTheme() {
    const theme = getTheme();
    setTheme(theme);
  }

  private handleToggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    setTheme(this.theme);
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
