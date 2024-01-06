import dayjs from 'dayjs';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('calendar-card')
export class CalendarCard extends LitElement {
  @property({ attribute: false }) date!: Date;

  render() {
    return html`
      <div class="cal-container">
        <div class="month">${this.getMonth()}</div>
        <div class="day">${this.getDay()}</div>
      </div>
    `;
  }

  private getMonth() {
    return dayjs(this.date).format('MMM');
  }

  private getDay() {
    return dayjs(this.date).format('D');
  }

  static styles = css`
    .cal-container {
      border: 1px solid var(--sl-color-neutral-300);
      border-radius: var(--sl-border-radius-medium);
      width: 3rem;
      text-align: center;
    }

    .month {
      background-color: var(--sl-color-neutral-300);
      font-size: var(--sl-font-size-x-small);
      padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
    }

    .day {
      font-size: var(--sl-font-size-medium);
      color: var(--sl-color-neutral-700);
      padding: var(--sl-spacing-x-small);
    }
  `;
}
