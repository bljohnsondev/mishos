import { consume } from '@lit/context';
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '@/components/base-element';
import { appContext } from '@/store/app-context';
import { sharedStyles } from '@/styles/shared-styles';
import { AppStore } from '@/types';
import { createEvent, getTheme, initializeFormEvents, setTheme } from '@/utils';

import { saveConfig } from './settings-api';

import '@/features/shows/shows-search-form';
import '@/layout/app-layout';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

interface SettingsFormValues {
  theme?: string;
  notifierUrl?: string;
}

@customElement('settings-page')
export class SettingsPage extends BaseElement {
  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appStore?: AppStore;

  @query('form') settingsForm!: HTMLFormElement;

  render() {
    const notifierUrl = this.appStore?.initData?.userConfig?.notifierUrl;

    return html`
      <app-layout icon="cog-6-tooth" headerTitle="Settings" selected="settings">
        <shows-search-form slot="header"></shows-search-form>
        <section class="content">
          <form>
            <div>
              <sl-select name="theme" label="Theme" value=${getTheme()}>
                <sl-option value="dark">Dark</sl-option>
                <sl-option value="light">Light</sl-option>
              </sl-select>
            </div>
            <div>
              <sl-input name="notifierUrl" label="Notifier URL" value=${ifDefined(notifierUrl)}></sl-input>
            </div>
            <div>
              <sl-button variant="primary" type="submit">Save</sl-button>
            </div>
          </form>
        </section>
      </app-layout>
    `;
  }

  private async handleSubmit() {
    const data: SettingsFormValues = serialize(this.settingsForm);
    if (data.theme) {
      setTheme(data.theme);
    }

    if (this.appStore?.initData?.userConfig) {
      if (data.notifierUrl !== this.appStore?.initData?.userConfig?.notifierUrl) {
        await saveConfig({
          notifierUrl: data.notifierUrl,
        });
        this.dispatchEvent(createEvent('load-initdata'));
      }
    }

    this.toast({ variant: 'success', message: 'Settings saved' });
  }

  firstUpdated() {
    initializeFormEvents(this.settingsForm, () => this.handleSubmit());
  }

  static styles = [
    sharedStyles,
    css`
      .content {
        margin: var(--sl-spacing-large);
      }

      form {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        @media screen and (min-width: 640px) {
          width: 400px;
        }
      }

      sl-input::part(form-control-label),
      sl-select::part(form-control-label) {
        padding-bottom: var(--sl-spacing-2x-small);
      }
    `,
  ];
}
