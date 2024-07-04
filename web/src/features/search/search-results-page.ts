import { Router, type RouterLocation } from '@vaadin/router';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import type { SearchResultDto, ShowCardBadge } from '@/types';

import { searchShowsFromProvider } from './search-api';

import '@/features/shows/show-card';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/badge/badge.js';

@customElement('search-results-page')
export class SearchResultsPage extends BaseElement {
  @property({ type: Object }) location?: RouterLocation;

  @state() query?: string | null;
  @state() results?: SearchResultDto[];

  private addedBadge: ShowCardBadge = { variant: 'primary', label: 'Added' };

  render() {
    return this.query
      ? html`
          <app-layout icon="magnifying-glass" headerTitle="Search Results" selected="shows">
            <shows-search-form slot="header" query=${this.query}></shows-search-form>
            <section class="content" @select-show=${this.handleSelectShow}>
              <div class="results">
                ${
                  this.results && this.results.length > 0
                    ? this.results.map(
                        show => html`
                        <a href="#" class="card-link" @click=${(event: Event) => this.handleSelectShow(event, show)}>
                          <show-card
                            image=${ifDefined(show.imageMedium)}
                            name=${ifDefined(show.name)}
                            network=${ifDefined(show.network)}
                            .badge=${show.following ? this.addedBadge : undefined}
                          ></show-card>
                        </a>
                      `
                      )
                    : null
                }
              </div>
            </section>
          </app-layout>
        `
      : null;
  }

  private handleSelectShow(event: Event, show: SearchResultDto) {
    event.preventDefault();
    if (show && this.results && show.providerId) {
      if (show.following && show.showId) {
        Router.go(`/show/view/${show.showId}`);
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
        this.results = await this.callApi(() => searchShowsFromProvider(query));
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
