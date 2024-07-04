import '@fontsource/inter';
import '@fontsource/inter/500.css';

import { provide } from '@lit/context';
import { HTTPError } from 'ky';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { kyWrapper } from './lib/ky-wrapper';
import { appContext } from './store/app-context';
import type { AppStore, InitData } from './types';
import { setTheme } from './utils';

import './components/app-root';
import './components/loading-spinner';

import '@fontsource/inter';

type AppState = 'init' | 'loading' | 'error' | 'loaded';

@customElement('app-entry')
export class AppEntry extends LitElement {
  @provide({ context: appContext })
  appStore!: AppStore;

  @state() currentState: AppState = 'init';
  @state() errorMessage?: string;

  constructor() {
    super();
    this.addEventListener('update-appstore', (event: Event) =>
      this.handleUpdateAppStore((event as CustomEvent).detail)
    );
    this.addEventListener('load-initdata', () => this.loadInitData());
  }

  render() {
    return choose(this.currentState, [
      ['loading', () => html`<div class="middle"><loading-spinner loading></loading-spinner></div>`],
      [
        'error',
        () =>
          html`
            <div id="error" class="middle">
              Error loading application.  Please check the server logs.
              <span>${this.errorMessage ?? 'An unknown error occurred'}</span>
            </div>`,
      ],
      ['loaded', () => html`<app-root></app-root>`],
    ]);
  }

  private async loadInitData() {
    try {
      const initData: InitData | undefined = await kyWrapper.get('auth/init').json();

      this.currentState = 'loaded';

      this.appStore = {
        ...this.appStore,
        initData,
      };

      // original code set the light/dark theme here
      const theme = initData?.userConfig?.theme;

      if (!theme) {
        // if a theme isn't set then default to the system setting
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      } else {
        setTheme(theme);
      }
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 401) {
        // an error 401 is fine and means the user isn't logged in - this is not an error condition
        this.currentState = 'loaded';
        this.errorMessage = undefined;
      } else if (error instanceof Error) {
        this.currentState = 'error';
        this.errorMessage = error.message ?? 'An unknown error occurred';
      } else {
        this.currentState = 'error';
        this.errorMessage = 'An unknown error occurred';
      }
    }
  }

  private handleUpdateAppStore(newStore?: AppStore) {
    if (newStore) {
      this.appStore = newStore;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.currentState = 'loading';
    this.loadInitData();
  }

  static styles = css`
    .middle {
      width: 65%;
      margin: 2rem auto;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-800);
      text-align: center;
    }

    #error {
      padding: var(--sl-spacing-large);
      border: 1px solid var(--sl-color-neutral-300);
      border-radius: var(--sl-border-radius-medium);
    }

    #error > span {
      display: block;
      color: var(--sl-color-red-700);
      margin-top: 0.5rem;
    }
  `;
}
