import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '@/components/base-element';
import type { UserDto } from '@/types';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@customElement('user-item')
export class UserItem extends BaseElement {
  @property({ attribute: false }) user?: UserDto;
  @property({ type: Boolean }) disabled = false;

  render() {
    if (!this.user) return null;

    return html`
      <a
        href=""
        class=${this.disabled ? 'disabled' : ''}
        @click=${(event: Event) => this.handleClickUser(event)}
      >
        <div class="name">
          <sl-icon library="hi-solid" name="user"></sl-icon>
          ${this.user.username}
        </div>
        <div class="role">${this.user.role === '' ? 'no role' : this.user.role}</div>
      </a>
    `;
  }

  private handleClickUser(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disabled) {
      this.dispatchCustomEvent('select', this.user);
    }
  }

  static styles = css`
    a {
      display: inline-block;
      width: 8rem;
      border: 1px solid var(--sl-color-sky-400);
      padding: 0.5rem;
      border-radius: var(--sl-border-radius-medium);
      text-decoration: none;
      color: var(--sl-color-neutral-800);
      transition: 200ms;
    }

    a:not(.disabled):hover {
      background-color: var(--sl-color-sky-100);
    }

    a.disabled {
      border: 1px solid var(--sl-color-neutral-400);
      color: var(--sl-color-neutral-600);
      cursor: not-allowed;
    }

    .name {
      display: flex;
      align-items: center;
      font-weight: bold;
    }

    sl-icon {
      font-size: 1.2rem;
      margin-right: var(--sl-spacing-x-small);
    }

    .role {
      font-style: italic;
      padding-top: var(--sl-spacing-x-small);
      color: var(--sl-color-neutral-600);
    }
  `;
}
