import { Router, RouterLocation } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { sharedStyles } from '@/styles/shared-styles';
import { ShowDto } from '@/types';

import { searchShowsFromProvider } from './search-api';

import '@/features/shows/show-card';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/badge/badge';

@customElement('search-results-page')
export class SearchResultsPage extends LitElement {
  @property({ type: Object }) location?: RouterLocation;

  @state() query?: string | null;
  @state() results?: ShowDto[];

  render() {
    return html`
      <app-layout icon="tv" headerTitle="Search Results" selected="shows">
        <shows-search-form slot="header" query=${this.query}></shows-search-form>
        <section class="content" @select-show=${this.handleSelectShow}>
          <div class="results">
            ${this.results && this.results.length > 0
              ? this.results.map(
                  show => html`
                    <a href="#" class="card-link" @click=${(event: Event) => this.handleSelectShow(event, show)}>
                      <show-card
                        image=${show.imageMedium}
                        name=${show.name}
                        network=${show.network}
                        .badge=${show.added ? { label: 'Added' } : undefined}
                      ></show-card>
                    </a>
                  `
                )
              : null}
          </div>
        </section>
      </app-layout>
    `;
  }

  private handleSelectShow(event: Event, show: ShowDto) {
    event.preventDefault();
    if (show && this.results && show.providerId) {
      if (show.added && show.id) {
        Router.go(`/show/view/${show.id}`);
      } else {
        Router.go(`/show/preview/${show.providerId}`);
      }
    }
  }

  async willUpdate() {
    if (this.location?.search) {
      const query = new URLSearchParams(this.location.search).get('q');
      if (query && query !== this.query) {
        this.query = query;
        this.results = await searchShowsFromProvider(query);
      }
    }
  }

  static styles = [
    sharedStyles,
    css`
      .results {
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
        gap: var(--sl-spacing-medium);
        margin: var(--sl-spacing-large);
      }
    `,
  ];
}
