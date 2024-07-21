import { css, html, nothing } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';

import '@/components/header-button';
import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

import './settings-account';
import './settings-data';
import './settings-general';
import './settings-users';

@customElement('settings-page')
export class SettingsPage extends BaseElement {
  @state() section = 'general';

  @query('form') settingsForm!: HTMLFormElement;

  render() {
    return html`
      <app-layout icon="cog-6-tooth" headerTitle="Settings" selected="settings">
        <ul class="header-tabs" slot="header">
          <li>
            <header-button
              ?active=${this.section === 'general'}
              @click=${() => {
                this.section = 'general';
              }}
            >
              General
            </header-button>
          </li>
          <li>
            <header-button
              ?active=${this.section === 'account'}
              @click=${() => {
                this.section = 'account';
              }}
            >
              Account
            </header-button>
          </li>
          <li>
            <header-button
              ?active=${this.section === 'data'}
              @click=${() => {
                this.section = 'data';
              }}
            >
              Data
            </header-button>
          </li>
          ${when(
            this.isAdmin(),
            () => html`
              <li>
                <header-button
                  ?active=${this.section === 'users'}
                  @click=${() => {
                    this.section = 'users';
                  }}
                >
                  Users
                </header-button>
              </li>
            `,
            () => nothing
          )}
        </ul>
        <section class="content">
          ${choose(this.section, [
            ['general', () => html`<settings-general></settings-general>`],
            ['account', () => html`<settings-account></settings-account>`],
            ['data', () => html`<settings-data></settings-data>`],
            ['users', () => (this.isAdmin() ? html`<settings-users></settings-users>` : nothing)],
          ])}
        </section>
      </app-layout>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .content {
        margin: var(--sl-spacing-large);
      }
    `,
  ];
}
