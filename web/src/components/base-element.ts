import { Router } from '@vaadin/router';
import { HTTPError } from 'ky';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { ToastMessage } from '@/types';
import { clearToken, createEvent } from '@/utils';

export interface CallApiOptions {
  target?: HTMLElement;
  toastErrors?: boolean;
  loadingSpinner?: boolean;
}

export class BaseElement extends LitElement {
  @state() protected loading: boolean = false;

  protected startLoading(target?: HTMLElement) {
    this.loading = true;
    this.dispatchCustomEvent('app-loading', true, target);
  }

  protected stopLoading(target?: HTMLElement) {
    this.loading = false;
    this.dispatchCustomEvent('app-loading', false, target);
  }

  protected toast(message: ToastMessage, target?: HTMLElement) {
    this.dispatchCustomEvent('toast', message, target);
  }

  protected dispatchCustomEvent<T>(eventName: string, payload?: T, target?: HTMLElement): void {
    if (target) target.dispatchEvent(createEvent(eventName, payload));
    else this.dispatchEvent(createEvent(eventName, payload));
  }

  protected async callApi<T>(
    func: () => any,
    options: CallApiOptions = { target: this, toastErrors: true, loadingSpinner: true }
  ): Promise<T | undefined> {
    const { target = this, toastErrors = true, loadingSpinner = true } = options;

    try {
      if (loadingSpinner) this.dispatchCustomEvent('app-loading', true, target);
      const json = await func();
      if (loadingSpinner) this.dispatchCustomEvent('app-loading', false, target);

      const isError = json?.error === true && json?.errorMessage;

      if (toastErrors && isError) {
        this.toast({ variant: 'danger', message: json.errorMessage }, target);
      } else if (!isError) {
        return json;
      }
    } catch (error) {
      if (loadingSpinner) this.dispatchCustomEvent('app-loading', false, target);

      if (toastErrors && error instanceof HTTPError && error.response?.status === 400) {
        const errorJson = await error.response.json();
        const errorMessage = errorJson?.message || errorJson?.error;
        if (errorMessage) {
          this.toast({ variant: 'danger', message: errorMessage }, target);
        } else {
          this.toast({ variant: 'danger', message: error.message ?? 'An unknown error occurred' }, target);
        }
      } else if (toastErrors && error instanceof HTTPError && error.response?.status === 401) {
        // on a 401 unauthorized remove any existing token and redirect
        clearToken();
        Router.go('/login');
      } else if (toastErrors && error instanceof HTTPError) {
        const json = await error.response.json();
        this.toast({ variant: 'danger', message: json.error ?? 'An unknown error occurred' }, target);
      } else if (toastErrors && error instanceof Error) {
        this.toast({ variant: 'danger', message: error.message ?? 'An unknown error occurred' }, target);
      }
    }

    return undefined;
  }
}
