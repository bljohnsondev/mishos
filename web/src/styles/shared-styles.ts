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
`;
