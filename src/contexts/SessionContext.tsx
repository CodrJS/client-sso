"use client";
import createCtx from "@/utils/createCtx";
import { OryClient } from "@/utils/ory/client";
import { Session } from "@ory/client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

// this sets the typing expected by the provider component and useContext function.
interface SessionCtxType {
  session: Session | undefined;
  hasSession: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

// create the context and provider with the custom createCtx utility.
const [useContext, Provider] = createCtx<SessionCtxType>("session");

export const SessionProvider = function SessionProvider({
  children,
}: PropsWithChildren) {
  const [session, setSession] = useState<Session | undefined>();
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const refresh = () => {
    setIsLoading(true);
    return OryClient.toSession()
      .then(({ data }) => {
        setSession(data);
        setHasSession(true);
      })
      .catch((err: AxiosError<Session | undefined>) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return router.push("/login?aal=aal2");
          case 401:
            // do nothing, the user is not logged in
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  // return provider with context return type.
  return (
    <Provider value={{ session, hasSession, isLoading, refresh }}>
      {children}
    </Provider>
  );
};

// setup file exports.
const SessionContext = {
  useSession: useContext,
  SessionProvider: Provider,
};

export default SessionContext;
export const useSession = useContext;
