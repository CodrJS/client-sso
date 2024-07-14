"use client";
import createCtx from "@/utils/createCtx";
import { handleFlowError } from "@/utils/ory";
import { OryClient } from "@/utils/ory/client";
import type { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client";
import type { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useSession } from "./SessionContext";

// create the context and provider with the custom createCtx utility.
type RegistrationFlowCtxType = {
  flow: RegistrationFlow | undefined;
  onSubmit: (values: UpdateRegistrationFlowBody) => Promise<void>;
};

const [useContext, Provider] =
  createCtx<RegistrationFlowCtxType>("registrationFlow");

export const RegistrationFlowProvider = function RegistrationFlowProvider({
  children,
}: PropsWithChildren) {
  const query = useSearchParams();
  const router = useRouter();
  const [flow, setFlow] = useState<RegistrationFlow>();
  const { refresh } = useSession();

  const returnTo = query.get("return_to");
  const flowId = query.get("flow");

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) return;

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      OryClient.getRegistrationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "registration", setFlow));
      return;
    }

    // Otherwise we initialize it
    OryClient.createBrowserRegistrationFlow({
      returnTo: returnTo ? String(returnTo) : undefined,
    })
      .then(({ data }) => {
        setFlow(data);
        router.push(`/registration?flow=${data.id}`);
      })
      .catch(handleFlowError(router, "registration", setFlow));
  }, [flowId, returnTo, flow, router]);

  const onSubmit = (values: UpdateRegistrationFlowBody) => {
    return (
      OryClient.updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
      })
        // We logged in successfully! Let's bring the user home.
        .then(({ data }) => {
          refresh();

          // continue_with is a list of actions that the user might need to take before the recovery update is complete.
          // It could, for example, contain a link to the settings form.
          if (data.continue_with) {
            for (const item of data.continue_with) {
              switch (item.action) {
                case "show_settings_ui":
                  router.push("/settings?flow=" + item.flow.id);
                  return;
                case "show_verification_ui":
                  router.push("/verification?flow=" + item.flow.id);
                  return;
              }
            }
          }

          if (flow?.return_to) {
            window.location.href = flow?.return_to;
            return;
          }
          router.push("/");
        })
        .catch(handleFlowError(router, "registration", setFlow))
        .catch((err: AxiosError<RegistrationFlow | undefined>) => {
          // If the previous handler did not catch the error it's most likely a form validation error
          if (err.response?.status === 400) {
            // Yup, it is!
            setFlow(err.response?.data);
            return;
          }

          return Promise.reject(err);
        })
    );
  };

  // return provider with context return type.
  return <Provider value={{ flow, onSubmit }}>{children}</Provider>;
};

// setup file exports.
const RegistrationFlowContext = {
  useRegistrationFlow: useContext,
  RegistrationFlowProvider: Provider,
};

export default RegistrationFlowContext;
export const useRegistrationFlow = useContext;
