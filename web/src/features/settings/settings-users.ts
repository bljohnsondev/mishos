import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { BaseElement } from '@/components/base-element';
import { deleteUser, getUsers, saveUser } from '@/features/admin/admin-api';
import type { UserDto } from '@/types';

import '@shoelace-style/shoelace/dist/components/button/button.js';

import '@/features/admin/user-edit';
import './user-item';

@customElement('settings-users')
export class SettingsUsers extends BaseElement {
  @state() selectedUser?: UserDto;
  @state() users?: UserDto[];

  render() {
    const currentId = this.appStore?.initData?.user?.id;

    if (!this.isAdmin()) return html`<div>Unauthorized</div>`;

    return this.selectedUser
      ? html`
        <user-edit
          .user=${this.selectedUser}
          @close=${this.handleCloseEditUser}
          @save-user=${this.handleSaveUser}
          @delete-user=${this.handleDeleteUser}
        ></user-edit>
      `
      : html`
        <div class="actions">
          <sl-button @click=${this.handleClickAdd}>
            Add
          </sl-button>
        </div>
        <div class="user-group">
          ${map(
            this.users,
            user => html`
              <user-item
                .user=${user}
                ?disabled=${currentId === user.id}
                @select=${this.handleChangeUser}
              ></user-item>
            `
          )}
        </div>
      `;
  }

  private handleClickAdd() {
    this.selectedUser = {};
  }

  private handleChangeUser(event: Event) {
    if (event && event instanceof CustomEvent) {
      this.selectedUser = event.detail;
    }
  }

  private async handleSaveUser(event: Event) {
    if (event && event instanceof CustomEvent && event.detail) {
      const user = event.detail as UserDto;

      const newUser = await this.callApi<UserDto | undefined>(() => saveUser(user));

      if (newUser && this.users) {
        if (this.users.some(u => u.id === newUser.id)) {
          // replace with the saved user
          this.users = this.users?.map(current => {
            return current.id === newUser?.id ? newUser : current;
          });
        } else {
          // this must me a new user so add it
          this.users = [...this.users, newUser];
        }

        this.selectedUser = undefined;
        this.toast({ variant: 'success', message: `User ${newUser.username} saved` });
      }
    }
  }

  private async handleDeleteUser(event: Event) {
    if (event && event instanceof CustomEvent && event.detail) {
      const user = event.detail as UserDto;

      if (user && user.id && user.id !== 1) {
        this.selectedUser = undefined;

        const userId = user.id;
        await this.callApi(() => deleteUser(userId));

        this.users = this.users?.filter(current => current.id !== userId);
        this.toast({ variant: 'success', message: `User ${user.username} deleted` });
      }
    }
  }

  private handleCloseEditUser() {
    this.selectedUser = undefined;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.users = await this.callApi(() => getUsers());
  }

  static styles = css`
    .actions {
      margin-bottom: 1rem;
    }

    .user-group {
      display: flex;
      gap: 1rem;
    }
  `;
}
