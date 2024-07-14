"use client";
import createCtx from "@/utils/createCtx";
import { OryClient } from "@/utils/ory/client";
import { FlowError } from "@ory/client";
import type { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

// create the context and provider with the custom createCtx utility.
type ErrorFlowCtxType = [
  FlowError | undefined,
  Dispatch<SetStateAction<FlowError | undefined>>
];

const [useContext, Provider] = createCtx<ErrorFlowCtxType>("errorFlow");

export const ErrorFlowProvider = function ErrorFlowProvider({
  children,
}: PropsWithChildren) {
  const query = useSearchParams();
  const router = useRouter();
  const [flow, setFlow] = useState<FlowError>();

  const id = query.get("id");

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) return;

    OryClient.getFlowError({ id: String(id) })
      .then(({ data }) => {
        // @ts-ignore
        delete data.error?.debug;
        setFlow(data);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          // The error id could not be found. Let's just redirect home!
          case 403:
          // The error id could not be fetched due to e.g. a CSRF issue. Let's just redirect home!
          case 410:
            // The error id expired. Let's just redirect home!
            return router.push("/");
        }

        return Promise.reject(err);
      });
  }, [id, flow, router]);

  // return provider with context return type.
  return <Provider value={[flow, setFlow]}>{children}</Provider>;
};

// setup file exports.
const ErrorFlowContext = {
  useFlowError: useContext,
  FlowErrorProvider: Provider,
};

export default ErrorFlowContext;
export const useFlowError = useContext;
