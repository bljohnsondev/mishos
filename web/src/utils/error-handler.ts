export const initializeFormEvents = (form: HTMLFormElement, onSubmit: (event: Event) => void) => {
  form.addEventListener('submit', (event: Event) => {
    // initializing the form automatically prevents the default submit behavior
    event.preventDefault();
    onSubmit(event);
  });

  form.addEventListener('sl-invalid', cancelEventDefault, { capture: true });
};

export const cancelEventDefault = (event: Event) => {
  event.preventDefault();
};
