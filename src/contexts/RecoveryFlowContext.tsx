"use client";
import createCtx from "@/utils/createCtx";
import { handleFlowError } from "@/utils/ory";
import { OryClient } from "@/utils/ory/client";
import type { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import type { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useSession } from "./SessionContext";

// create the context and provider with the custom createCtx utility.
type RecoveryFlowCtxType = {
  flow: RecoveryFlow | undefined;
  onSubmit: (update: UpdateRecoveryFlowBody) => Promise<void>;
};

const [useContext, Provider] = createCtx<RecoveryFlowCtxType>("recoveryFlow");

export const RecoveryFlowProvider = function RecoveryFlowProvider({
  children,
}: PropsWithChildren) {
  const query = useSearchParams();
  const router = useRouter();
  const [flow, setFlow] = useState<RecoveryFlow>();
  const { refresh } = useSession();

  const returnTo = query.get("return_to");
  const flowId = query.get("flow");

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) return;

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      OryClient.getRecoveryFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "recovery", setFlow));
      return;
    }

    // Otherwise we initialize it
    OryClient.createBrowserRecoveryFlow({
      returnTo: returnTo ? String(returnTo) : undefined,
    })
      .then(({ data }) => {
        setFlow(data);
        router.push(`/recovery?flow=${data.id}`);
      })
      .catch(handleFlowError(router, "recovery", setFlow));
  }, [flowId, returnTo, flow, router]);

  const onSubmit = (values: UpdateRecoveryFlowBody) => {
    return OryClient.updateRecoveryFlow({
      flow: String(flow?.id),
      updateRecoveryFlowBody: values,
    })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        setFlow(data);
        refresh();

        // continue_with is a list of actions that the user might need to take before the recovery update is complete.
        // It could, for example, contain a link to the settings form.
        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_settings_ui":
                router.push("/settings/password?flow=" + item.flow.id);
                return;
              case "show_verification_ui":
                router.push("/verification?flow=" + item.flow.id);
                return;
            }
          }
        }
      })
      .catch(handleFlowError(router, "recovery", setFlow))
      .catch((err: AxiosError<RecoveryFlow | undefined>) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the form validation had an error
            setFlow(err.response?.data);
            return;
        }

        throw err;
      });
  };

  // return provider with context return type.
  return <Provider value={{ flow, onSubmit }}>{children}</Provider>;
};

// setup file exports.
const RecoveryFlowContext = {
  useRecoveryFlow: useContext,
  RecoveryFlowProvider: Provider,
};

export default RecoveryFlowContext;
export const useRecoveryFlow = useContext;
