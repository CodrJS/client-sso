import { FormEvent, MouseEvent, useState } from "react";

export default function useFormHandler<T extends {}>() {
  const [isLoading, setIsLoading] = useState(false);

  // Handles form submission
  const handleSubmit = (
    event: FormEvent<HTMLFormElement> | MouseEvent,
    onSubmit: (values: T) => Promise<void>,
  ): Promise<T | void> => {
    // Prevent all native handlers
    event.stopPropagation();
    event.preventDefault();

    // Prevent double submission!
    if (isLoading) return Promise.resolve();

    const form = event.currentTarget;

    let body: T | undefined;

    if (form && form instanceof HTMLFormElement) {
      const formData = new FormData(form);

      // map the entire form data to JSON for the request body
      body = Object.fromEntries(formData) as T;

      const hasSubmitter = (evt: any): evt is { submitter: HTMLInputElement } =>
        "submitter" in evt;

      // We need the method specified from the name and value of the submit button.
      // when multiple submit buttons are present, the clicked one's value is used.
      if (hasSubmitter(event.nativeEvent)) {
        const method = event.nativeEvent.submitter;
        body = {
          ...body,
          ...{ [method.name]: method.value },
        };
      }
    }

    setIsLoading(true);

    return onSubmit({ ...body } as T)
      .then(() => body)
      .finally(() => {
        // We wait for reconciliation and update the state after 50ms
        // Done submitting - update loading status
        setIsLoading(false);
        return body;
      });
  };

  return { isLoading, handleSubmit };
}
