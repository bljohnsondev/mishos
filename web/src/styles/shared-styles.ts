import { css } from 'lit';

export const sharedStyles = css`
  sl-input::part(form-control-label) {
    margin-bottom: var(--sl-spacing-x-small);
  }

  sl-select::part(form-control-label) {
    margin-bottom: var(--sl-spacing-x-small);
  }

  .error-message {
    color: var(--sl-color-danger-700);
    font-size: var(--sl-font-size-small);
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

  .action-buttons {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-medium);
  }

  .episode-name {
    color: var(--sl-color-neutral-800);
    padding-top: var(--sl-spacing-x-small);
    padding-bottom: var(--sl-spacing-x-small);
    font-size: var(--sl-font-size-small);
  }

  @media screen and (min-width: 1024px) {
    .header-tabs {
      margin-left: 1rem;
    }
  }
`;
