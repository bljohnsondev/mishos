import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SideMenuItem } from './side-menu-item';

import './side-menu';

@customElement('app-layout')
export class AppLayout extends LitElement {
  @property({ attribute: false }) sideitems?: SideMenuItem[];
  @property() selected?: string;

  render() {
    return html`
      <main class="app-container">
        <side-menu .items=${this.sideitems} selected=${this.selected}></side-menu>
        <div class="content">
          <slot></slot>
        </div>
      </main>
      <slot name="footer"></slot>
    `;
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
