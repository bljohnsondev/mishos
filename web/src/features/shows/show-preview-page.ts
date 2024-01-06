import { Router, RouterLocation } from '@vaadin/router';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { sharedStyles } from '@/styles/shared-styles';
import { ShowDto } from '@/types';
import { createToastEvent } from '@/utils';

import { followShow, getProviderPreview } from './shows-api';

import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import './show-details';

@customElement('show-preview-page')
export class ShowPreviewPage extends LitElement {
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
      const newShow: ShowDto = await followShow(event.detail.providerId);
      if (newShow.id) {
        this.dispatchEvent(
          createToastEvent({
            variant: 'success',
            message: `${newShow.name} has been added`,
          })
        );
        Router.go(`/show/view/${newShow.id}`);
      }
    }
  }

  private async loadPreview(providerId: string) {
    this.show = await getProviderPreview(providerId);
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
