import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { sharedStyles } from '@/styles/shared-styles';
import { getTheme } from '@/utils';

import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

@customElement('settings-page')
export class SettingsPage extends LitElement {
  render() {
    return html`
      <app-layout icon="cog-6-tooth" headerTitle="Settings" selected="settings">
        <shows-search-form slot="header"></shows-search-form>
        <section class="content">
          <form>
            <div class="form-grid">
              <div class="grid-item">Theme</div>
              <div class="grid-item">
                <sl-select name="theme" value=${getTheme()}>
                  <sl-option value="dark">Dark</sl-option>
                  <sl-option value="light">Light</sl-option>
                </sl-select>
              </div>
            </div>
            <sl-button variant="primary" type="submit">Save</sl-button>
          </form>
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

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--sl-spacing-medium);
        margin-bottom: var(--sl-spacing-large);
        @media screen and (min-width: 1024px) {
          width: 20rem;
        }
      }

      .grid-item {
        display: flex;
        align-items: center;
      }

      sl-select::part(form-control-label) {
        padding-bottom: var(--sl-spacing-2x-small);
      }
    `,
  ];
}
