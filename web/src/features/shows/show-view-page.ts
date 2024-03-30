import { Router, RouterLocation } from '@vaadin/router';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import { ShowDto } from '@/types';
import { createToastEvent } from '@/utils';

import { getShowDetails, refreshShow, unfollowShow, watchEpisode } from './shows-api';

import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import './show-details';

@customElement('show-view-page')
export class ShowViewPage extends BaseElement {
  @property({ type: Object }) location?: RouterLocation;

  @state() show?: ShowDto | null;
  @state() togglePrevious: boolean = false;

  render() {
    return html`
      <app-layout icon="tv" headerTitle="Shows" selected="shows">
        <shows-search-form slot="header"></shows-search-form>
        <section class="content">
          ${this.show
            ? html`<show-details
                .show=${this.show}
                @watch-episode=${this.handleWatch}
                @unwatch-episode=${this.handleUnwatch}
                @toggle-previous=${this.handleTogglePrevious}
                @remove-show=${this.handleRemoveShow}
                @refresh-show=${this.handleRefreshShow}
              ></show-details>`
            : this.show === null
              ? html`<div>Show could not be found</div>`
              : null}
        </section>
      </app-layout>
    `;
  }

  private async handleWatch(event: Event) {
    this.handleToggleWatch(event, true);
  }

  private async handleUnwatch(event: Event) {
    this.handleToggleWatch(event, false);
  }

  private async handleToggleWatch(event: Event, watched: boolean) {
    if (event && event instanceof CustomEvent) {
      const watchData = event.detail;
      if (watchData.episodeId && this.show?.ID) {
        await this.callApi(() => watchEpisode(watchData.episodeId, watched, this.togglePrevious));
        await this.loadShow(this.show.ID);
      }
    }
  }

  private handleTogglePrevious(event: Event) {
    if (event && event instanceof CustomEvent) {
      this.togglePrevious = event.detail;
    }
  }

  private async handleRefreshShow(event: Event) {
    if (event && event instanceof CustomEvent && event.detail && this.show?.ID) {
      const showId = event.detail;
      await this.callApi(() => refreshShow(showId));
      await this.loadShow(this.show.ID);
      this.dispatchEvent(
        createToastEvent({
          variant: 'success',
          message: `${this.show.name} has been updated`,
        })
      );
    }
  }

  private async handleRemoveShow(event: Event) {
    if (event && event instanceof CustomEvent && event.detail) {
      const show = event.detail;
      await this.callApi(() => unfollowShow(event.detail));
      this.dispatchEvent(
        createToastEvent({
          variant: 'success',
          message: `${show.name} has been removed`,
        })
      );
      Router.go('/shows');
    }
  }

  private async loadShow(showId: string) {
    const show = await this.callApi(() => getShowDetails(showId));
    this.show = show ? show : null;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.location?.params && this.location.params.id) {
      const showId = this.location.params.id.toString();
      await this.loadShow(showId);
    }
  }

  static styles = [
    sharedStyles,
    css`
      .content {
        margin: var(--sl-spacing-large);
        color: var(--sl-color-neutral-800);
      }
    `,
  ];
}
