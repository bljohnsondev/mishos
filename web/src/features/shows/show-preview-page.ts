import { Router, RouterLocation } from '@vaadin/router';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';
import { FollowShowResponseDto, ShowDto } from '@/types';
import { createToastEvent } from '@/utils';

import { followShow, getProviderPreview } from './shows-api';

import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import './show-details';

@customElement('show-preview-page')
export class ShowPreviewPage extends BaseElement {
  @property({ type: Object }) location?: RouterLocation;

  @state() show?: ShowDto;
  @state() togglePrevious: boolean = false;

  render() {
    return html`
      <app-layout icon="tv" headerTitle="Shows" selected="shows">
        <shows-search-form slot="header"></shows-search-form>
        <section class="content">
          ${this.show
            ? html`<show-details .show=${this.show} preview @add-show=${this.handleAddShow}></show-details>`
            : null}
        </section>
      </app-layout>
    `;
  }

  private async handleAddShow(event: Event) {
    if (event && event instanceof CustomEvent && event.detail?.providerId) {
      const response: FollowShowResponseDto | undefined = await this.callApi(() => followShow(event.detail.providerId));
      if (response && response.ID) {
        this.dispatchEvent(
          createToastEvent({
            variant: 'success',
            message: `${response.name} has been added`,
          })
        );
        Router.go(`/show/view/${response.ID}`);
      }
    }
  }

  private async loadPreview(providerId: string) {
    this.show = await this.callApi(() => getProviderPreview(providerId));
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.location?.params && this.location.params.id) {
      const providerId = this.location.params.id.toString();
      await this.loadPreview(providerId);
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
