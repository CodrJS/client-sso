"use client";
import createCtx from "@/utils/createCtx";
import { handleFlowError } from "@/utils/ory";
import { OryClient } from "@/utils/ory/client";
import type { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client";
import type { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

// create the context and provider with the custom createCtx utility.
type VerificationFlowCtxType = {
  flow: VerificationFlow | undefined;
  onSubmit: (update: UpdateVerificationFlowBody) => Promise<void>;
};

const [useContext, Provider] =
  createCtx<VerificationFlowCtxType>("verificationFlow");

export const VerificationFlowProvider = function VerificationFlowProvider({
  children,
}: PropsWithChildren) {
  const query = useSearchParams();
  const router = useRouter();
  const [flow, setFlow] = useState<VerificationFlow>();

  const returnTo = query.get("return_to");
  const flowId = query.get("flow");

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) return;

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      OryClient.getVerificationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "verification", setFlow));
      return;
    }

    // Otherwise we initialize it
    OryClient.createBrowserVerificationFlow({
      returnTo: returnTo ? String(returnTo) : undefined,
    })
      .then(({ data }) => {
        setFlow(data);
        router.push(`/verification?flow=${data.id}`);
      })
      .catch(handleFlowError(router, "verification", setFlow));
  }, [flowId, returnTo, flow, router]);

  const onSubmit = (values: UpdateVerificationFlowBody) => {
    return OryClient.updateVerificationFlow({
      flow: String(flow?.id),
      updateVerificationFlowBody: values,
    })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        setFlow(data);

        if (data?.return_to) {
          window.location.href = data?.return_to;
          return;
        }
      })
      .catch(handleFlowError(router, "verification", setFlow))
      .catch((err: AxiosError<any | undefined>) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the form validation had an error
            setFlow(err.response?.data);
            return;
          case 410:
            const newFlowID = err.response.data?.use_flow_id as string;
            router.push(`/verification?flow=${newFlowID}`);

            OryClient.getVerificationFlow({ id: newFlowID }).then(({ data }) =>
              setFlow(data),
            );
            return;
        }

        throw err;
      });
  };

  // return provider with context return type.
  return <Provider value={{ flow, onSubmit }}>{children}</Provider>;
};

// setup file exports.
const VerificationFlowContext = {
  useVerificationFlow: useContext,
  VerificationFlowProvider: Provider,
};

export default VerificationFlowContext;
export const useVerificationFlow = useContext;
