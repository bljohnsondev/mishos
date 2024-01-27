import { Router, RouterLocation } from '@vaadin/router';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import { ShowDto } from '@/types';
import { createToastEvent } from '@/utils';

import { addWatch, getShowDetails, refreshShow, unfollowShow } from './shows-api';

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
                @toggle-watched=${this.handleToggleWatched}
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

  private async handleToggleWatched(event: Event) {
    if (event && event instanceof CustomEvent) {
      const watchData = event.detail;
      if (watchData.episodeId && this.show?.id) {
        await this.callApi(() =>
          addWatch(watchData.episodeId, watchData.watched, this.togglePrevious ? 'previous' : 'single')
        );
        await this.loadShow(this.show.id);
      }
    }
  }

  private handleTogglePrevious(event: Event) {
    if (event && event instanceof CustomEvent) {
      this.togglePrevious = event.detail;
    }
  }

  private async handleRefreshShow(event: Event) {
    if (event && event instanceof CustomEvent && event.detail && this.show?.id) {
      const showId = event.detail;
      await this.callApi(() => refreshShow(showId));
      await this.loadShow(this.show.id);
      this.dispatchEvent(
        createToastEvent({
          variant: 'success',
          message: `${this.show.name} has been updated`,
        })
      );
    }
  }

  private async handleRemoveShow(event: Event) {
    if (event && event instanceof CustomEvent && event.detail.providerId && event.detail.id) {
      const show = event.detail;
      await this.callApi(() => unfollowShow(show));
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
