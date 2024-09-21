import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '@/components/base-element';
import { FormController } from '@/components/form-controller';
import { sharedStyles } from '@/styles/shared-styles';
import { setTheme } from '@/utils';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';

import { saveConfigGeneral, sendTestNotification } from './settings-api';

interface SettingsFormValues {
  theme?: string;
  notifierUrl?: string;
  hideSpoilers?: string;
}

@customElement('settings-general')
export class SettingsGeneral extends BaseElement {
  // @ts-ignore - the form controller is attached automatically so ignore unused error
  private formController: FormController<SettingsFormValues> = new FormController<SettingsFormValues>(this, {
    onSubmit: values => this.handleSubmit(values),
  });

  render() {
    const notifierUrl = this.appStore?.initData?.userConfig?.notifierUrl;
    const hideSpoilers = this.appStore?.initData?.userConfig?.hideSpoilers;
    const theme = this.appStore?.initData?.userConfig?.theme;

    return html`
      <form id="settings-form">
        <div>
          <sl-select name="theme" label="Theme" value=${ifDefined(theme)}>
            <sl-option value="dark">Dark</sl-option>
            <sl-option value="light">Light</sl-option>
          </sl-select>
        </div>
        <div class="notifier-container">
          <sl-input name="notifierUrl" label="Notifier URL" value=${ifDefined(notifierUrl)}></sl-input>
          <sl-button variant="neutral" @click=${this.handleSendTest}>Send Test</sl-button>
        </div>
        <div>
          <sl-switch name="hideSpoilers" ?checked=${hideSpoilers}>Hide Spoilers</sl-switch>
        </div>
        <div class="action-buttons">
          <sl-button variant="primary" type="submit">Save</sl-button>
        </div>
      </form>
    `;
  }

  private async handleSubmit(values: SettingsFormValues) {
    if (this.appStore?.initData?.userConfig) {
      await this.callApi(() => {
        saveConfigGeneral({
          notifierUrl: values.notifierUrl,
          theme: values.theme,
          hideSpoilers: values.hideSpoilers === 'on',
        });
      });

      if (this.appStore?.initData?.userConfig) {
        this.appStore.initData.userConfig.notifierUrl = values.notifierUrl;
        this.appStore.initData.userConfig.theme = values.theme;
        this.appStore.initData.userConfig.hideSpoilers = values.hideSpoilers === 'on';

        this.dispatchCustomEvent('update-appstore', this.appStore);

        setTheme(values.theme ?? 'light');
      }
    }

    this.toast({ variant: 'success', message: 'Settings saved' });
  }

  private async handleSendTest() {
    if (this.formController.form) {
      const values = serialize(this.formController.form);

      if (values.notifierUrl) {
        const errorMessage = await sendTestNotification(values.notifierUrl as string);
        if (errorMessage) {
          this.toast({ variant: 'danger', message: errorMessage });
        } else {
          this.toast({ variant: 'success', message: 'Test message sent' });
        }
      }
    }
  }

  static styles = [
    sharedStyles,
    css`
      #settings-form {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
      }

      sl-input::part(form-control-label),
      sl-select::part(form-control-label) {
        padding-bottom: var(--sl-spacing-2x-small);
      }

      sl-select[name="theme"] {
        width: 10rem;
      }

      sl-input[name="notifierUrl"] {
        width: 100%;
      }

      .notifier-container {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
      }

      @media screen and (min-width: 640px) {
        #settings-form {
          width: 600px;
        }

        .notifier-container {
          flex-direction: row;
          align-items: flex-end;
        }
      }
    `,
  ];
}
