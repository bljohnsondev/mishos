import { consume } from '@lit/context';
import { css, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '@/components/base-element';
import { appContext } from '@/store/app-context';
import { sharedStyles } from '@/styles/shared-styles';
import { AppStore } from '@/types';

import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

import './settings-account';
import './settings-general';

@customElement('settings-page')
export class SettingsPage extends BaseElement {
  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appStore?: AppStore;

  @state() section: string = 'general';

  @query('form') settingsForm!: HTMLFormElement;

  render() {
    return html`
      <app-layout icon="cog-6-tooth" headerTitle="Settings" selected="settings">
        <ul class="header" slot="header">
          <li>
            <sl-button
              variant="text"
              size="medium"
              class=${classMap({ 'header-selected': this.section === 'general' })}
              @click=${() => (this.section = 'general')}
            >
              General
            </sl-button>
          </li>
          <li>
            <sl-button
              variant="text"
              size="medium"
              class=${classMap({ 'header-selected': this.section === 'account' })}
              @click=${() => (this.section = 'account')}
            >
              Account
            </sl-button>
          </li>
        </ul>
        <section class="content">
          ${choose(this.section, [
            ['general', () => html`<settings-general></settings-general>`],
            ['account', () => html`<settings-account></settings-account>`],
          ])}
        </section>
      </app-layout>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .header {
        list-style: none;
        padding: 0;
        margin: 0;
        margin-left: 1rem;
        display: flex;
        align-items: center;
        gap: var(--sl-spacing-large);
        :is(li) {
          font-size: var(--sl-font-size-small);
        }
        :is(sl-button)::part(label) {
          color: var(--sl-color-neutral-800);
        }
        :is(sl-button).header-selected::part(label) {
          color: var(--sl-color-sky-500);
        }
      }

      .content {
        margin: var(--sl-spacing-large);
      }
    `,
  ];
}
