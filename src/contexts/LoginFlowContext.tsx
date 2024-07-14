"use client";
import createCtx from "@/utils/createCtx";
import { handleFlowError } from "@/utils/ory";
import { OryClient } from "@/utils/ory/client";
import type { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import type { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useSession } from "./SessionContext";

// create the context and provider with the custom createCtx utility.
type LoginFlowCtxType = {
  flow: LoginFlow | undefined;
  isLoading: boolean;
  onSubmit: (values: UpdateLoginFlowBody) => Promise<void>;
};

const [useContext, Provider] = createCtx<LoginFlowCtxType>("loginFlow");

export const LoginFlowProvider = function LoginFlowProvider({
  children,
}: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const query = useSearchParams();
  const router = useRouter();
  const [flow, setFlow] = useState<LoginFlow>();
  const {
    isLoading: isSessionLoading,
    hasSession,
    refresh: refreshSesion,
  } = useSession();

  const returnTo = query.get("return_to");
  const flowId = query.get("flow");
  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = query.get("refresh");
  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = query.get("aal");

  useEffect(() => {
    if (!isSessionLoading && hasSession) {
      setIsLoading(false);
      router.push("/");
      return;
    }

    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) return;

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      OryClient.getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "login", setFlow));
      return;
    }

    // Otherwise we initialize it
    OryClient.createBrowserLoginFlow({
      refresh: Boolean(refresh),
      aal: aal ? String(aal) : undefined,
      returnTo: returnTo ? String(returnTo) : undefined,
    })
      .then(({ data }) => {
        setFlow(data);
        router.push(`/login?flow=${data.id}`);
      })
      .catch(handleFlowError(router, "login", setFlow));
  }, [
    flowId,
    aal,
    refresh,
    returnTo,
    flow,
    router,
    isSessionLoading,
    hasSession,
  ]);

  const onSubmit = (values: UpdateLoginFlowBody) => {
    setIsLoading(true);
    return (
      OryClient.updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
        // We logged in successfully! Let's bring the user home.
        .then(() => {
          refreshSesion();
          if (flow?.return_to) {
            window.location.href = flow?.return_to;
            return;
          }
        })
        .catch(handleFlowError(router, "login", setFlow))
        .catch((err: AxiosError<LoginFlow | undefined>) => {
          // If the previous handler did not catch the error it's most likely a form validation error
          if (err.response?.status === 400) {
            // Yup, it is!
            setFlow(err.response?.data);
            return;
          }

          return Promise.reject(err);
        })
        .finally(() => setIsLoading(false))
    );
  };

  // return provider with context return type.
  return <Provider value={{ flow, onSubmit, isLoading }}>{children}</Provider>;
};

// setup file exports.
const LoginFlowContext = {
  useLoginFlow: useContext,
  LoginFlowProvider: Provider,
};

export default LoginFlowContext;
export const useLoginFlow = useContext;
