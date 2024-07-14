"use client";
import { AxiosError } from "axios";
import { OryClient } from "../ory/client";
import { DependencyList, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

// Returns a function which will log the user out
export default function useLogout(deps: DependencyList = []) {
  const [logoutToken, setLogoutToken] = useState<string>("");
  const router = useRouter();
  const { refresh } = useSession();

  useEffect(() => {
    OryClient.createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return () => {
    if (logoutToken) {
      OryClient.updateLogoutFlow({ token: logoutToken })
        .then(() => refresh())
        .then(() => router.push("/login"));
    }
  };
}
