import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { sharedStyles } from '@/styles/shared-styles';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

interface SearchFormValues {
  query?: string;
}

@customElement('shows-search-form')
export class ShowsSearchForm extends LitElement {
  @query('form') searchForm?: HTMLFormElement;

  @property({ type: String }) headerTitle?: string;
  @property({ type: String }) query?: string;

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <sl-input name="query" placeholder="Find Shows" value=${this.query ?? ''} clearable>
          <sl-icon slot="suffix" library="hi-outline" name="magnifying-glass"></sl-icon>
        </sl-input>
      </form>
    `;
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

  static styles = [
    sharedStyles,
    css`
      form sl-input::part(base) {
        background-color: transparent;
      }

      @media screen and (min-width: 1024px) {
        sl-input::part(base) {
          max-width: 320px;
        }
      }
    `,
  ];
}
