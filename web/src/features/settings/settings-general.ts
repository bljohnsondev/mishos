import { consume } from '@lit/context';
import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '@/components/base-element';
import { appContext } from '@/store/app-context';
import { AppStore } from '@/types';
import { getTheme, setTheme, initializeForm } from '@/utils';

import { saveConfigGeneral } from './settings-api';

interface SettingsFormValues {
  theme?: string;
  notifierUrl?: string;
}

@customElement('settings-general')
export class SettingsGeneral extends BaseElement {
  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appStore?: AppStore;

  @query('form') settingsForm!: HTMLFormElement;

  render() {
    const notifierUrl = this.appStore?.initData?.userConfig?.notifierUrl;

    return html`
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
    `;
  }

  private async handleSubmit(values: SettingsFormValues) {
    if (values.theme) {
      setTheme(values.theme);
    }

    if (this.appStore?.initData?.userConfig) {
      if (values.notifierUrl !== this.appStore?.initData?.userConfig?.notifierUrl) {
        await saveConfigGeneral({
          notifierUrl: values.notifierUrl,
        });
        this.dispatchCustomEvent('load-initdata');
      }
    }

    this.toast({ variant: 'success', message: 'Settings saved' });
  }

  firstUpdated() {
    initializeForm<SettingsFormValues>(this.settingsForm, {
      onSubmit: values => this.handleSubmit(values),
    });
  }

  static styles = css`
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
  `;
}
