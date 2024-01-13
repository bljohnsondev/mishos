import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { sharedStyles } from '@/styles/shared-styles';

import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

@customElement('loading-spinner')
export class LoadingSpinner extends LitElement {
  @query('#spinner-button') spinnerButton?: HTMLButtonElement;

  @property({ type: Boolean }) loading: boolean = false;

  @state() focusedElement?: HTMLElement | null;

  render() {
    return this.loading
      ? html`
          <button id="spinner-button" class="reset-button" @keydown=${this.handleTrapFocus}>
            <sl-spinner style="--track-width: 3px; --indicator-color: var(--sl-color-neutral-800);"></sl-spinner>
          </button>
          <div class="overlay"></div>
        `
      : null;
  }

  private handleTrapFocus(event: Event) {
    event.preventDefault();
  }

  private getActiveElement(root: Document | ShadowRoot = document): Element | null {
    const activeEl = root.activeElement;

    if (!activeEl) {
      return null;
    }

    if (activeEl.shadowRoot) {
      return this.getActiveElement(activeEl.shadowRoot);
    } else {
      return activeEl;
    }
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('loading')) {
      const previousLoading: boolean | undefined = changedProperties.get('loading');

      if (previousLoading === false && this.loading === true) {
        // loading started - save the currently focused element
        this.focusedElement = this.getActiveElement(document) as HTMLElement | null;
      } else if (previousLoading === true && this.loading === false && this.focusedElement) {
        // loading stopped - refocus on previous element
        this.focusedElement.focus();
        this.focusedElement = undefined;
      }
    }
  }

  updated() {
    if (this.spinnerButton) this.spinnerButton.focus();
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        line-height: 0;
      }

      #spinner-button {
        z-index: 999;
      }

      sl-spinner {
        position: fixed;
        top: var(--sl-spacing-small);
        right: var(--sl-spacing-medium);
        font-size: 1.5rem;
        z-index: 999;
        @media screen and (min-width: 640px) {
          position: inherit;
        }
      }

      .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 99999;
        overflow: hidden;
      }
    `,
  ];
}
