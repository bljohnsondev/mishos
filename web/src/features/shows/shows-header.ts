import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { Router } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { logout } from '@/lib/auth';

import '@/layout/app-header';

import '@shoelace-style/shoelace/dist/components/avatar/avatar';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/menu/menu';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

interface SearchFormValues {
  query?: string;
}

@customElement('shows-header')
export class ShowsHeader extends LitElement {
  @query('form') searchForm?: HTMLFormElement;

  @property({ type: String }) headerTitle?: string;
  @property({ type: String }) query?: string;

  render() {
    return html`
      <app-header icon="tv" title=${this.headerTitle ?? 'Shows'}>
        <form @submit=${this.handleSubmit}>
          <sl-input name="query" placeholder="Find Shows" value=${this.query ?? ''} clearable>
            <sl-icon slot="suffix" library="hi-outline" name="magnifying-glass"></sl-icon>
          </sl-input>
        </form>
        <sl-dropdown distance="8" @sl-select=${this.handleAccountSelect}>
          <sl-avatar slot="trigger" label="User"></sl-avatar>
          <sl-menu>
            <sl-menu-item value="logout">Logout</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </app-header>
    `;
  }

  private handleAccountSelect(event: Event) {
    if (event && event instanceof CustomEvent && event.detail?.item?.value) {
      if (event.detail.item.value === 'logout') {
        logout();
      }
    }
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    if (this.searchForm) {
      const data = serialize(this.searchForm) as SearchFormValues;

      if (data.query) {
        Router.go(`/show/search?q=${data.query}`);
      }
    }
  }

  static styles = css`
    form {
      :is(sl-input)::part(base) {
        background-color: transparent;
      }
    }

    @media screen and (min-width: 1024px) {
      sl-input::part(base) {
        max-width: 320px;
      }
    }

    sl-dropdown {
      cursor: pointer;
      @media screen and (min-width: 1024px) {
        margin-left: auto;
      }
    }

    sl-avatar {
      --size: 2rem;
    }
  `;
}
