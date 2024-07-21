import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from './base-element';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

@customElement('confirm-dialog')
export class ConfirmDialog extends BaseElement {
  @property({ type: Boolean }) open = false;
  @property() label?: string;

  render() {
    return html`
      <sl-dialog label=${this.label || 'Confirm'} ?open=${this.open}>
        <slot></slot>
        <sl-button variant="primary" slot="footer" @click=${this.handleOk}>Ok</sl-button>
        <sl-button slot="footer" @click=${this.handleCancel}>Cancel</sl-button>
      </sl-dialog>
    `;
  }

  private handleOk(event: Event) {
    event.stopPropagation();
    this.dispatchCustomEvent('confirm-ok');
  }

  private handleCancel(event: Event) {
    event.stopPropagation();
    this.dispatchCustomEvent('confirm-cancel');
  }
}
