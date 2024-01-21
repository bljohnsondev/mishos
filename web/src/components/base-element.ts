import { LitElement } from 'lit';

import { ToastMessage } from '@/types';
import { createEvent, createToastEvent } from '@/utils';

export class BaseElement extends LitElement {
  toast(message: ToastMessage) {
    this.dispatchEvent(createToastEvent(message));
  }

  dispatchCustomEvent(name: string, detail?: any) {
    this.dispatchEvent(createEvent(name, detail));
  }
}
