import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { sharedStyles } from '@/styles/shared-styles';
import type { ErrorMessage } from '@/types';

@customElement('form-error-message')
export class FormErrorMessage extends LitElement {
  @property({ attribute: false }) errors?: ErrorMessage[];

  @property() for!: string;

  render() {
    const error = this.errors ? this.errors.find(err => err.name === this.for) : undefined;
    return error
      ? html`
          <div id=${`fem-${this.for}`} class=${classMap({ 'error-message': true, hidden: !error })}>
            ${error?.message}
          </div>
        `
      : null;
  }

  static styles = [
    sharedStyles,
    css`
      .hidden {
        display: none;
      }

      div {
        padding-top: var(--sl-spacing-2x-small);
      }
    `,
  ];
}
