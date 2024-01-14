import { css } from 'lit';

export const sharedStyles = css`
  sl-input::part(form-control-label) {
    margin-bottom: var(--sl-spacing-x-small);
  }

  .error-message {
    color: var(--sl-color-red-500);
    font-size: var(--sl-font-size-small);
  }

  .card-link {
    color: var(--sl-color-neutral-800);
    text-decoration: none;
    transition: all 200ms ease;
    &:hover {
      /* transform: scale(1.01); */
      filter: brightness(110%);
    }
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

  .episode-title-info {
    display: flex;
    align-items: center;
    flex-shrink: 1;
    font-size: var(--sl-font-size-small);
    color: var(--sl-color-neutral-700);
    :is(info-tooltip) {
      margin-left: auto;
      @media screen and (min-width: 640px) {
        margin-left: 0;
      }
    }
  }
`;
