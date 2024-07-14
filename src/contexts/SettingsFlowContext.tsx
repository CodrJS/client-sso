"use client";
import createCtx from "@/utils/createCtx";
import { handleFlowError } from "@/utils/ory";
import { OryClient } from "@/utils/ory/client";
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

// this sets the typing expected by the provider component and useContext function.
interface SettingsCtxType {
  flow: SettingsFlow | undefined;
  onSubmit: (values: UpdateSettingsFlowBody) => Promise<void>;
}

// create the context and provider with the custom createCtx utility.
const [useContext, Provider] = createCtx<SettingsCtxType>("settingsFlow");

export const SettingsFlowProvider = function SettingsFlowProvider({
  children,
}: PropsWithChildren) {
  const query = useSearchParams();
  const router = useRouter();
  const [flow, setFlow] = useState<SettingsFlow | undefined>();

  const returnTo = query.get("return_to");
  const flowId = query.get("flow");

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) return;

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      OryClient.getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "settings", setFlow));
      return;
    }

    // Otherwise we initialize it
    OryClient.createBrowserSettingsFlow({
      returnTo: String(returnTo || ""),
    })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "settings", setFlow));
  }, [flowId, returnTo, flow, router]);

  const onSubmit = (values: UpdateSettingsFlowBody) => {
    return OryClient.updateSettingsFlow({
      flow: String(flow?.id),
      updateSettingsFlowBody: values,
    })
      .then(({ data }) => {
        // The settings have been saved and the flow was updated. Let's show it to the user!
        setFlow(data);

        // continue_with is a list of actions that the user might need to take before the settings update is complete.
        // It could, for example, contain a link to the verification form.
        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_verification_ui":
                router.push("/verification?flow=" + item.flow.id);
                return;
            }
          }
        }

        if (data.return_to) {
          window.location.href = data.return_to;
          return;
        }
      })
      .catch(handleFlowError(router, "settings", setFlow))
      .catch(async (err: AxiosError<SettingsFlow>) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data);
          return;
        }

        return Promise.reject(err);
      });
  };

  // return provider with context return type.
  return <Provider value={{ flow, onSubmit }}>{children}</Provider>;
};

// setup file exports.
const SettingsFlowContext = {
  useSettingsFlow: useContext,
  SettingsFlowProvider: Provider,
};

export default SettingsFlowContext;
export const useSettingsFlow = useContext;
