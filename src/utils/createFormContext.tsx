"use client";
import createCtx from "@/utils/createCtx";
import { useState } from "react";
import type { FormEvent, MouseEvent, PropsWithChildren } from "react";

function createForm<T extends {}>(name?: string) {
  // create the context and provider with the custom createCtx utility.
  type FormCtxType<T extends {}> = {
    form: T | undefined;
    setValue: (name: string, value: string | number | boolean | null | undefined) => void;
    setValues: (values: { [k in keyof T]: string | number | boolean | undefined }) => void;
    handleSubmit: (
      event: FormEvent<HTMLFormElement> | MouseEvent,
      onSubmit: (values: T) => Promise<void>
    ) => Promise<void>;
  };

  const [useContext, Provider] = createCtx<FormCtxType<any>>(name || "form");

  const FormProvider = function FormProvider({ children }: PropsWithChildren) {
    const [values, setValuesState] = useState<T>({} as T);
    const [isLoading, setIsLoading] = useState(false);

    const setValue = (name: string, value: string | number | boolean | null | undefined) => {
      setValuesState({ ...values, [name]: value ?? undefined } as T);
    };

    const setValues = (vals: { [k: string]: string | number | boolean | undefined }) => {
      setValuesState({ ...values, ...vals });
    };

    // Handles form submission
    const handleSubmit = (
      event: FormEvent<HTMLFormElement> | MouseEvent,
      onSubmit: (values: T) => Promise<void>
    ) => {
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

        const hasSubmitter = (
          evt: any
        ): evt is { submitter: HTMLInputElement } => "submitter" in evt;

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

      return onSubmit({ ...body, ...values }).finally(() => {
        // We wait for reconciliation and update the state after 50ms
        // Done submitting - update loading status
        setIsLoading(false);
      });
    };

    // return provider with context return type.
    return (
      <Provider value={{ form: values, setValue, setValues, handleSubmit }}>
        {children}
      </Provider>
    );
  };

  // setup file exports.
  const FormContext = {
    useForm: useContext,
    FormProvider,
  };

  return FormContext;
}

export default createForm;
