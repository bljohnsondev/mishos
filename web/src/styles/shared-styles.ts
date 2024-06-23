import { css } from 'lit';

export const sharedStyles = css`
  sl-input::part(form-control-label) {
    margin-bottom: var(--sl-spacing-x-small);
  }

  .error-message {
    color: var(--sl-color-red-600);
    font-size: var(--sl-font-size-x-small);
  }

  .card-link {
    color: var(--sl-color-neutral-800);
    text-decoration: none;
    transition: all 200ms ease;
  }

  .card-link:hover {
    /* transform: scale(1.01); */
    filter: brightness(110%);
  }

  .reset-button {
    all: unset;
    line-height: 0;
  }

  .no-image-placeholder {
    width: 200px;
    height: 280px;
    background-color: var(--sl-color-neutral-300);
    border-radius: var(--sl-border-radius-medium);
  }

  .header-tabs {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-large);
  }

  .header-tabs li {
    font-size: var(--sl-font-size-small);
  }

  .header-tabs sl-button::part(label) {
    color: var(--sl-color-neutral-800);
  }

  .header-tabs sl-button::part(label):hover {
    color: var(--sl-color-neutral-950);
  }

  .header-tabs sl-button.header-selected::part(label) {
    color: var(--sl-color-sky-500);
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-medium);
  }

  @media screen and (min-width: 1024px) {
    .header-tabs {
      margin-left: 1rem;
    }
  }
`;
