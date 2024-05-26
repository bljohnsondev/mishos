import { css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import { BaseElement } from '@/components/base-element';
import { sharedStyles } from '@/styles/shared-styles';

import { getExportData, importData } from './settings-api';

@customElement('settings-data')
export class SettingsData extends BaseElement {
  @query('#import-form') importForm!: HTMLFormElement;
  @query('#imported-file') importedFile!: HTMLInputElement;

  @state() showImportForm = false;

  render() {
    return html`
      <div class="action-buttons">
        <sl-button variant="neutral" @click=${this.handleExport}>Export Data</sl-button>
        <sl-button variant="neutral" @click=${this.handleShowImport}>Import Data</sl-button>
      </div>
      <sl-dialog label="Import Data" ?open=${this.showImportForm} @sl-hide=${this.handleCloseImport}>
        <form id="import-form">
          <div>
            This import form is used for importing previously exported data.  This import should only be used
            on a newly created database and will fail if there is any existing show data.
          </div>
          <input id="imported-file" class="file-input" type="file"></input>
          <div class="button-bar">
            <sl-button variant="primary" @click=${this.handleRunImport}>Import</sl-button>
            <sl-button variant="neutral" @click=${this.handleCloseImport}>Cancel</sl-button>
          </div>
        </form>
      </sl-dialog>
    `;
  }

  private handleShowImport() {
    this.showImportForm = true;
  }

  private handleCloseImport() {
    this.showImportForm = false;
  }

  private async handleRunImport() {
    const files = this.importedFile.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('file', files[0]);
      const isImported = await this.callApi(() => importData(formData));
      if (isImported) {
        this.importForm.reset();
        this.showImportForm = false;
        this.toast({ variant: 'success', message: 'Shows successfully imported' });
      }
    }
  }

  private async handleExport() {
    const exported = await getExportData();

    // hacky way to download JSON from an in-memory object
    const url = window.URL.createObjectURL(exported);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = 'exported-shows.json';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  }

  firstUpdated() {
    this.importForm.addEventListener('submit', () => this.handleRunImport());
  }

  static styles = [
    sharedStyles,
    css`
      #import-form {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
      }

      .button-bar {
        display: flex;
        gap: var(--sl-spacing-medium);
      }

      .file-input::file-selector-button {
        border: 0;
        background-color: var(--sl-color-neutral-400);
        border-radius: var(--sl-border-radius-medium);
        line-height: var(--sl-line-height-looser);
        box-sizing: border-box;
        border: 1px solid var(--sl-color-neutral-500);
        padding-inline: 1rem;
      }
    `,
  ];
}
