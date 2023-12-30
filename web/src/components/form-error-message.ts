import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { sharedStyles } from '@/styles/shared-styles';
import { ErrorMessage } from '@/types';

@customElement('form-error-message')
export class FormErrorMessage extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .hidden {
        display: none;
      }
    `,
  ];

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
}
